import Express from "express";
import { Server } from "http";
import socketIO from "socket.io";
import { v4 } from "uuid";

const app = new Express();
const server = Server(app);
const io = socketIO(server);

app.set("view engine", "ejs");
app.use(Express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${v4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(4000, () => console.log("Server up..."));
