// Make connection
var socket = io.connect('http://localhost:4050');

// Query DOm

var message = document.getElementById('message');
var handle = document.getElementById('handle');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback')

//Emit event

socket.emit('storeClientInfo', { customId: 'Lucas' })

btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    })
})

btn.addEventListener('click', function(){
    socket.emit('storeClientInfo', {customId: message.value})
})

//Listen for events

socket.on('storeClientInfo', function(data){
    output.innerHTML += '<p><strong>'+data+': </strong>'+ data+'</p>'
})

socket.on('typing', function (data) {
    feedback.innerHTML += '<p><em>' + data +' is typing</em></p>'
})