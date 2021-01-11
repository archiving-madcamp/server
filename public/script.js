const socket = io('/')
// {transports: ['websocket'], upgrade: false}
const videoGrid = document.getElementById('video-grid')
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
console.log("sadfad")
// promise
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    // 이벤트를 보냄(다른 유저가 들어왔을 때 실행)
    // socket.on('user-connected', (userId, userStream) => {
    //     // 상대방의 스트림을 내 화면에 띄워줌
    //     // peerJS에서 call을 요청하는 부분
    //     connectToNewUser(userId, stream)
    // })
    // peerJS에서 call 요청에 따른 answer부분
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            // 상대방에게 내 화면을 띄워줌
            addVideoStream(video, userVideoStream)
        })
    })
}).catch(err => console.log(err))

// peer가 들어왔을 때 관련 정보를 보냄(자동으로 아이디 생성)
peer.on('open', id => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        
        // 그냥 화면을 그림
        addVideoStream(myVideo, stream)
        socket.emit('join-room', ROOM_ID, id, stream)
    }).catch(err => console.log(err))
})

// // peer가 연결되었을 때 새로운 유저에게 화면을 띄워주는 함수
// const connectToNewUser = (userId, stream) => {
//     console.log(userId)
//     const call = peer.call(userId, stream)
//     const video = document.createElement('video')
//     // 상대방의 stream을 내 화면에 추가한다.
//     // 비디오 생성
//     //call.answer(stream)
//     //addVideoStream(video, stream)
//     call.on('stream', userVideoStream => {
//         console.log("4")
//         // 상대방 쪽에 보낸사랑의 영상을 띄워줌
//         addVideoStream(video, userVideoStream)
//     })
// }

// 동영상을 띄워주는 함수
const addVideoStream = (video, stream) => {
    console.log("화면 추가")
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}