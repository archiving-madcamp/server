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
    // 그냥 화면을 그림
    console.log("1")
    // 이벤트를 보냄(다른 유저가 들어왔을 때 실행)
    socket.on('user-connected', (userId, userStream) => {
        // 새로들어온 사람의 아이디
        console.log("which: " + userId)
        connectToNewUser(userId, stream)
    })
    // 답을 한다.
    peer.on('call', call => {
        console.log("3")
        call.answer(stream)
        //console.log("이건 뭐지. " + userId)
        // 상대방의 stream을 추가한다.
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
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
        console.log('입장하였습니다.')
        console.log("my Id: " + id)
    }).catch(err => console.log(err))
})

// peer가 연결되었을 때 새로운 유저에게 화면을 띄워주는 함수
const connectToNewUser = (userId, stream) => {
    console.log(userId)
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    // 상대방의 stream을 내 화면에 추가한다.
    // 비디오 생성
    call.answer(stream)
    addVideoStream(video, stream)
    call.on('stream', userVideoStream => {
        console.log("화면 추가 함수를 실행")
        // 상대방 쪽에 보낸사랑의 영상을 띄워줌
        addVideoStream(video, userVideoStream)
    })
}

// 동영상을 띄워주는 함수
const addVideoStream = (video, stream) => {
    console.log("화면 추가")
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}