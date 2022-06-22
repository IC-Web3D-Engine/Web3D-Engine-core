import { web3DEngine } from "../../declarations/web3DEngine";
import { AuthClient } from "@dfinity/auth-client"

(function () {
    window.assetsBaseUri = "http://qyump-baaaa-aaaak-qarca-cai.raw.ic0.app/web3/"
    // window.assetsBaseUri = "http://rrkah-fqaaa-aaaaa-aaaaq-cai.localhost:8000/web3/"
    window.userPrincipal = null;
    const signIn = async () => {
        const client = await AuthClient.create()
        const result = await new Promise((resolve, reject) => {
          client.login({
            identityProvider: "https://identity.ic0.app",
            onSuccess: () => {
              const identity = client.getIdentity()
              const principal = identity.getPrincipal().toString()
              userPrincipal = principal
            //   console.log(userPrincipal)
             $.dialog({
                type : 'confirm',
                titleText : 'Identity Authentication',
                buttonText : {
                    ok : 'OK',
                    cancel : 'Cancel'
                },
                contentHtml : '<div style="width:70%;padding:15px;margin:0 auto;text-align:center;">Login successful!</div>'
            });
              resolve(true)
            },
            onError:() =>{
                resolve(false)
            }
          })
        })
        // console.log(result)
        return result
    }
    window.checkSignIn = () => {
        if(userPrincipal==null) {
            return false
        } else {
            return true
        }
    }
    window.showSignIn = async () => {
        if(userPrincipal==null) {
            $.dialog({
                type : 'confirm',
                titleText : 'Identity Authentication',
                buttonText : {
                    ok : 'Login',
                    cancel : 'Cancel'
                },
                onClickOk : function(){
                    signIn()
                },
                onClickCancel : function(){        		

                },
                contentHtml : '<div style="width:80%;padding:15px;margin:0 auto;text-align:center;">Welcome to Web3D Engine! Please login before use!</div>'
             });
        } else {
            console.log(userPrincipal)
        }
    }
    const uploadChunk = async ({batch_name,chunk}) => web3DEngine.create_chunk({
        batch_name,
        content:[...new Uint8Array(await chunk.arrayBuffer())]
    });
    const loadLink = async (batch_name,fileType) => {
        if(!batch_name){
          return;
        }
        let link = assetsBaseUri + batch_name;
        console.log(link)
        if(fileType==1) {
            await web3DEngine.create_assets(batch_name)
             $.dialog({
                type : 'confirm',
                titleText : 'Successful',
                buttonText : {
                    ok : 'Open it!',
                    cancel : 'Close'
                },
                onClickOk : function(){
                    window.open( link, '_blank' )
                },
                onClickCancel : function(){        		

                },
                contentHtml : '<div style="width:70%;padding:15px;margin:0 auto;text-align:center;">All files are deployed on IC!</div>'
            });
        }
    }
    window.uploadToIC = async (file,randomName,fileType)=>{
        if(!file) {
          alert("No file selected");
          return;
        }
        console.log("start upload");
      
        const batch_name = randomName + "/" + file.name;
        const chunks = [];
        const chunkSize = 1500000;
      
        for(let start = 0; start < file.size; start += chunkSize) {
          const chunk = file.slice(start, start  + chunkSize);
          chunks.push(uploadChunk({
            batch_name,
            chunk
          }));
        }
        const chunkIds = await Promise.all(chunks);
        console.log(chunkIds)
        await web3DEngine.commit_batch({
          batch_name,
          chunk_ids:chunkIds.map(({chunk_id})=>chunk_id),
          content_type:file.type
        })
        console.log("uploaded");
        await loadLink(batch_name,fileType);
    }
    window.btnClickToAssets = (e) => {
        console.log(e)
    }
    window.getUserAssets = async () => {
        const res = await web3DEngine.get_assets()
        console.log(res)
        let tr = ""
        for(let i=0; i<res.length; i++) {
            tr = tr + `<tr style="width:100%;">
                <td style="border: 0px;width:10%;">`+ res[i].id +`</td>
                <td style="border: 0px;width:30%;">`+ res[i].name.replace("/index.html","") +`</td>
                <td style="border: 0px;width:30%;"> `+ formatDate(Number(res[i].time / 1000000n))+` </td>
                <td style="border: 0px;width:30%;"><a href="`+ assetsBaseUri+res[i].name +`" target="_blank">view page</a></td>
                </tr>
                `
        }
        let htmlCode= `<table border="0">
            <tbody>
            `+tr+`
            </tbody>
            </table>`
        $.dialog({
			titleText : 'My Assets',
            buttonText : {
                ok : 'Ok',
                cancel : 'Close'
            },
			contentHtml : '<div style="width:100%;padding:15px;margin:0 auto;text-align:center;">' + htmlCode + '</div>'
		});
    }
    window.randomName = function(e) {   
        e = e || 32;
        let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        let a = t.length;
        let n = "";
        for (let z = 0; z < e; z++) n += t.charAt(Math.floor(Math.random() * a));
        let time = Date.now() + "";
        return (n + time);
    }
    const formatDate = (time) => {
        let date = new Date(time);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
        // return y + '-' + MM + '-' + d;
    }
    window.alertError = function (msg) {
        alert(msg);
    };
}());