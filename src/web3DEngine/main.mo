import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Iter "mo:base/Iter";
import Error "mo:base/Error";
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import List "mo:base/List";
import Debug "mo:base/Debug";

import Types "./types";

actor Assets {
  private let MAX_ASSETS_PER_USER = 500;
  private var nextChunkID: Nat = 0;
  
  private stable var nextAssetId: Nat = 1;

  private let chunks: HashMap.HashMap<Nat, Types.Chunk> = HashMap.HashMap<Nat, Types.Chunk>(
    0, Nat.equal, Hash.hash,
  );

  private let assets: HashMap.HashMap<Text, Types.Asset> = HashMap.HashMap<Text, Types.Asset>(
    0, Text.equal, Text.hash,
  );

  private var userAssetsMap = HashMap.HashMap<Types.PrincipalName, List.List<Types.AssetLogs>>(0, Text.equal, Text.hash);

  public shared({caller}) func create_assets(name: Text) : async () {
    let principalName = Principal.toText(caller);
    let userAssets : List.List<Types.AssetLogs> = Option.get(userAssetsMap.get(principalName), List.nil<Types.AssetLogs>());
    
    assert List.size(userAssets) < MAX_ASSETS_PER_USER;

    let newAsset: Types.AssetLogs = {
        id = nextAssetId; 
        name = name;
        time = Time.now();
    };
    nextAssetId += 1;
    userAssetsMap.put(principalName, List.push(newAsset, userAssets));
  };

  public shared query({caller}) func get_assets() : async [Types.AssetLogs] {
      let principalName = Principal.toText(caller);
      let userAssets = Option.get(userAssetsMap.get(principalName), List.nil());
      return List.toArray(userAssets);
  };

  public shared query({caller}) func http_request(
    request: Types.HttpRequest,
  ) : async Types.HttpResponse {

    if (request.method == "GET") {
      let split: Iter.Iter<Text> = Text.split(request.url, #char '?');
      let key:Text = Iter.toArray(split)[0];

      let asset: ?Types.Asset = assets.get(key);

      switch (asset) {
        case (?{content_type: Text; encoding: Types.AssetEncoding;}) {
          return {
            body = encoding.content_chunks[0];
            headers = [("Content-Type",content_type),
                      ("accept-ranges","bytes"),
                      ("cache-control","provate,max-age=0")];
            status_code = 200;
            streaming_strategy = create_strategy(
              key, 0, {content_type;encoding;}, encoding,
            );
          };
        };
        case null {
        };
      };
    };

    return {
      body = Blob.toArray(Text.encodeUtf8("Permission denied.Could not perform this operation"));
      headers = [];
      status_code = 403;
      streaming_strategy = null;
    }
  };

  private func create_strategy(
    key: Text,
    index: Nat,
    asset: Types.Asset,
    encoding: Types.AssetEncoding,
  ) : ?Types.StreamingStrategy {
    switch (create_token(key, index, encoding)) {
      case (null) { null };
      case (? token) {
        let self:Principal = Principal.fromActor(Assets);
        let canisterId:Text = Principal.toText(self);
        let canister = actor (canisterId) : actor { http_request_streaming_callback:shared () -> async() };

        return ?#Callback({
          token;
          callback = canister.http_request_streaming_callback;
        });
      };
    };
  };

  public shared query({caller}) func http_request_streaming_callback(
    st: Types.StreamingCallbackToken,
  ) : async Types.StreamingCallbackHttpResponse {

    switch (assets.get(st.key)) {
      case (null) throw Error.reject("key not found:" # st.key);
      case (? asset) {
        return {
          token = create_token(
            st.key,
            st.index,
            asset.encoding,
          );
          body = asset.encoding.content_chunks[st.index];
        };
      };
    };
  };

  private func create_token(
    key: Text,
    chunk_index: Nat,
    encoding: Types.AssetEncoding,
  ) : ?Types.StreamingCallbackToken {

    if (chunk_index + 1 >= encoding.content_chunks.size()) {
      null;
    } else {
      ?{
        key;
        index = chunk_index + 1;
        content_encoding = "gzip";
      };
    };
  };

  public shared({caller}) func create_chunk(chunk: Types.Chunk) : async {
    chunk_id : Nat
  } {
    let principalName = Principal.toText(caller);
    let userAssets : List.List<Types.AssetLogs> = Option.get(userAssetsMap.get(principalName), List.nil<Types.AssetLogs>());
    
    assert List.size(userAssets) < MAX_ASSETS_PER_USER;

    nextChunkID := nextChunkID + 1;
    chunks.put(nextChunkID, chunk);

    return {chunk_id = nextChunkID};
  };

  public shared({caller}) func commit_batch(
    {batch_name:Text; chunk_ids: [Nat]; content_type: Text;} : {
      batch_name: Text;
      content_type: Text;
      chunk_ids: [Nat];
    },
  ) : async () {
    var content_chunks : [[Nat8]] = [];

    for(chunk_id in chunk_ids.vals()) {
      let chunk: ?Types.Chunk = chunks.get(chunk_id);

      switch (chunk) {
        case (?{content}) {
          content_chunks := Array.append<[Nat8]>(content_chunks, [content]);
        };
        case null {
        };
      };
    };

    if (content_chunks.size() > 0) {
      var total_length = 0;
      for (chunk in content_chunks.vals()) total_length += chunk.size();

      assets.put(Text.concat("/web3/",batch_name),{
        content_type = content_type;
        encoding = {
          modified = Time.now();
          content_chunks;
          certified = false;
          total_length
        };
      });
    };
  };
};