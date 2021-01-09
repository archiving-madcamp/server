const socket = io('/')
const videoGrid = document.getElementById('video-grid')
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
})
const myVideo = document.createElement('video')
myVideo.muted = true

// promise
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        // 상대방의 stream을 추가한다.
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    // 이벤트를 보냄
    socket.on('user-connected', userId => {
        console.log("비디오를 킵니다. " + userId)
        connectToNewUser(userId, stream)
    })
}).catch(err => console.log(err))

// peer가 들어왔을 때 관련 정보를 보냄
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
    console.log('입장하였습니다.')
})

// peer가 연결되었을 때
const connectToNewUser = (userId, stream) => {
    console.log(userId)
    // 상대방을 부른다.
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    // 상대방의 stream을 내 화면에 추가한다.
    console.log("화면을 추가합니다.")
    call.on('stream', userVideoStream => {
        console.log("화면 추가 함수를 실행")
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    console.log("화면 추가")
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

