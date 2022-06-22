# IC Web3D Engine

## Quick Start ⚙

```
## Running the project locally

If you want to test your project locally, you can use the following commands:

​```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
​```
```

## Inspiration 🔮

I am an indie game developer.One of the work I'm most proud of has 400,000 players in a matter of months without promotion.So, at the time I was tempted to deploy my indie game on IC.

However, the huge and complex system of IC made me, an outsider, daunted at that time.Because of the complexity of the program, in the past it was difficult for me to port the previously developed games to the IC.

So, IC Web3D Engine was born!

Users can easily develop and deploy their own game on IC without knowing DFINITY DFK. Of course, other 3D application scenarios are also possible.

# This is a lightweight game engine fully deployed on IC!!





## What it does 🎡

Users can use this product like any other game engine.

Users can create scenes, create items, render lights or write scripts in this game engine, and can also preview the current work in real time. When the work is completed, users can click 【Deploy】>【Deploy to IC】to deploy their work to the IC.The whole process won't involve anything about the SDK.

It makes everything so easy.

No gas required! Store forever! Decentralized!

This product can allow more friends to join the construction of IC web3D, even if you don't know how to write code, you can make games or other 3D and VR scenes.



## How we built it  🔨

- We developed a simple static file server using motoko.
- We use Javascript to read and shard the cache of game deployments and deploy them to our development static file server.
- We have connected Internet Identity at the front end for authentication, protecting the privacy of game creators.
- Creators can view all their deployed works and share them with friends via private links.
- This game engine editor is based on Three.js, thanks to Three.js!

## How to Play it  🎮

1. Login using  Internet Identity.
2. If you are more familiar with game engines, you can get started directly.
3. If you are unfamiliar with game engines, you can click the 【Examples】button, and then select one of the examples to try.You can try changing the color of objects or backgrounds, or the angle of the camera.It's easy!
4. You can click the 【Play】button to perform a real-time demonstration, and click the 【Stop】 button to close the real-time demonstration.
5. When the work is completed, you can click【Deploy】->【Deploy to IC】to deploy your work with one click
6. After deployment, you can click【Deploy】->【My Assets】to view all your works.
7. Finally, have a good time!

## Challenges we ran into 🎢

- Developed simple server using motoko to host deployed works. It took a lot of time.
- Solve the problem of file storage and fragmented transfer in the front end, making large file transfer so easy.
- Having some difficulty accessing Internet Identity because I don't have a hardware device like Yubikey.
- I encountered a problem with cycles when deploying the entire project to the IC mainnet
- so on....


## Accomplishments that we're proud of 👏

- The entire product has been successfully deployed to the IC and can be used normally.
- I solved a lot of interesting problems in a week and it gave me a great sense of achievement.
- I hope this product can help you in the development of Internet Computer Ecosystem.

## What we learned 🎉

- independent thinking and problem solving.	
- how to use motoko.

## What's next for IC Web3D Engine 🧾

- Improve the motoko server and establish a canister management system.
- Write detailed documentation to tell everyone how to get started quickly.
- Looking for partners to reconstruct the architecture of front-end products
- Ask people where there is room for improvement.
- ......



## Play it  🎮

online demo:  https://q7vk3-myaaa-aaaak-qarcq-cai.ic0.app



## Who I am 👦

My name is Kevin and I worked in the Full-Stack development.
And I developed this game independently during the period of this hackathon.

I hope you like my work！Thanks~

e-mail: catmi9944@gmail.com