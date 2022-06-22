import Time "mo:base/Time";
module {

    public type PrincipalName = Text;

    public type AssetLogs = {
        id: Nat;
        name: Text;
        time: Time.Time;
    };

    public type HeaderField = (Text,Text);

    public type Chunk = {
        batch_name: Text;
        content :[Nat8];
    };

    public type Asset = {
        encoding: AssetEncoding;
        content_type: Text;
    };

    public type AssetEncoding = {
        modified: Int;
        content_chunks: [[Nat8]];
        total_length: Nat;
        certified: Bool;
    };

    public type HttpRequest = {
        method: Text;
        url: Text;
        headers: [HeaderField];
        body: [Nat8];
    };

    public type HttpResponse = {
        status_code: Nat16;
        headers: [HeaderField];
        body: [Nat8];
        streaming_strategy: ?StreamingStrategy;
    };

    public type StreamingCallbackToken = {
        key: Text;
        index: Nat;
        content_encoding: Text;
    };

    type CallbackStrategy = {
        callback: shared() -> async();
        token: StreamingCallbackToken;
    };

    public type StreamingStrategy =  {
        #Callback: CallbackStrategy;
    };

    public type StreamingCallbackHttpResponse = {
        body: [Nat8];
        token: ?StreamingCallbackToken;
    };
}