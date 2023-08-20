const app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("new-user-joined", function (name) {
    socket.emit("user-joined", {
      description: "Hey, welcome to the chat! " + name,
    });

    // If new user joined, let other users connected to the server know.
    socket.broadcast.emit("user-joined", {
      description: name + " joined the chat",
    });

    
    // If someone sends a message, broadcast it to other people.
    socket.on("send message", (chat) => {
      io.emit("send", { message: chat, name: name });
    });

    // If someone leaves the chat, let others know .
    socket.on("disconnect", function () {
      socket.broadcast.emit("left", { description: name + " left the chat" });
    });
  });
});

http.listen(3000, function () {
  console.log("Server listening on port : 3000");
});
