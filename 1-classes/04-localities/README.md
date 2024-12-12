---
tags:
  - class
unit: 2
date: 231002
---

|![\|50](https://i.imgur.com/N8z2xP4.png) | | |
|-|:-|-:|
|**class 05**|Dec 1st, 2023|*internet music 23/24*|

### class 05
# localities
---

## TCP

Transmission Control Protocol

Vint Cerf  (1973)

Robert Kahn (1974)

<iframe src="https://media.abilitymagazine.com/wp-content/uploads/2022/07/26021846/Bob-Kahn-and-Vint-Cerf-in-the-years.jpg" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>
---

## network layers 
 **Open Systems Interconnection model** (**OSI model**)

1. Physical (e.g. cable, RJ45)
2. Data Link (e.g. MAC, switches)
3. Network (e.g. IP, routers)
4. 
==4. Transport (e.g. TCP, UDP, port numbers)==

5. Session (e.g. Syn/Ack)
6. Presentation (e.g. encryption, ASCII, PNG, MIDI)
7. Application (e.g. SNMP, HTTP, FTP)

note:In [computer networking](https://en.wikipedia.org/wiki/Computer_network "Computer network"), the **transport layer** is a conceptual division of methods in the [layered architecture](https://en.wikipedia.org/wiki/Abstraction_layer "Abstraction layer") of protocols in the network stack in the [Internet protocol suite](https://en.wikipedia.org/wiki/Internet_protocol_suite "Internet protocol suite") and the [OSI model](https://en.wikipedia.org/wiki/OSI_model "OSI model"). The protocols of this layer provide end-to-end communication services for applications.[[1]](https://en.wikipedia.org/wiki/Transport_layer#cite_note-RFC_1122-1): §1.1.3  It provides services such as [connection-oriented communication](https://en.wikipedia.org/wiki/Connection-oriented_communication "Connection-oriented communication"), [reliability](https://en.wikipedia.org/wiki/Reliability_(computer_networking) "Reliability (computer networking)"), [flow control](https://en.wikipedia.org/wiki/Flow_control_(data) "Flow control (data)"), and [multiplexing](https://en.wikipedia.org/wiki/Multiplexing "Multiplexing").

---
<iframe src="https://www.plixer.com/wp-content/uploads/2018/11/network-layers-1.png" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>
---

## TCP 

### connection-oriented-communication 

 ==UDP [User Datagram Control]== 
note:It is normally easier for an application to interpret a connection as a [data stream](https://en.wikipedia.org/wiki/Data_stream "Data stream") rather than having to deal with the underlying connection-less models, such as the [datagram](https://en.wikipedia.org/wiki/Datagram "Datagram") model of the [User Datagram Protocol](https://en.wikipedia.org/wiki/User_Datagram_Protocol "User Datagram Protocol") (UDP) and of the [Internet Protocol](https://en.wikipedia.org/wiki/Internet_Protocol "Internet Protocol") (IP).

---

### reliability

==ACK<> NACK==

note:Packets may be lost during transport due to [network congestion](https://en.wikipedia.org/wiki/Network_congestion "Network congestion") and errors. By means of an [error detection code](https://en.wikipedia.org/wiki/Error_detection_code "Error detection code"), such as a [checksum](https://en.wikipedia.org/wiki/Checksum "Checksum"), the transport protocol may check that the data is not corrupted, and verify correct receipt by sending an [ACK](https://en.wikipedia.org/wiki/Acknowledgement_(data_networks) "Acknowledgement (data networks)") or [NACK](https://en.wikipedia.org/wiki/Negative-acknowledge_character "Negative-acknowledge character") message to the sender. [Automatic repeat request](https://en.wikipedia.org/wiki/Automatic_repeat_request "Automatic repeat request") schemes may be used to retransmit lost or corrupted data.
---


### multplexing

==PORTS==
note:[Ports](https://en.wikipedia.org/wiki/TCP_and_UDP_port "TCP and UDP port") can provide multiple endpoints on a single node. For example, the name on a postal address is a kind of multiplexing and distinguishes between different recipients of the same location. Computer applications will each listen for information on their own ports, which enables the use of more than one [network service](https://en.wikipedia.org/wiki/Network_service "Network service") at the same time. It is part of the transport layer in the [TCP/IP model](https://en.wikipedia.org/wiki/TCP/IP_model "TCP/IP model"), but of the [session layer](https://en.wikipedia.org/wiki/Session_layer "Session layer") in the OSI model.
---


## WebSocket
![](https://www.vaadata.com/blog/wp-content/uploads/2020/07/Schema-websockets-1.jpg)
note:**WebSocket** is a computer [communications protocol](https://en.wikipedia.org/wiki/Communications_protocol "Communications protocol"), providing [simultaneous two-way](https://en.wikipedia.org/wiki/Full-duplex "Full-duplex") communication channels over a single [Transmission Control Protocol](https://en.wikipedia.org/wiki/Transmission_Control_Protocol "Transmission Control Protocol") (TCP) connection. The WebSocket protocol was standardized by the [IETF](https://en.wikipedia.org/wiki/Internet_Engineering_Task_Force "Internet Engineering Task Force") as [RFC](https://en.wikipedia.org/wiki/RFC_(identifier) "RFC (identifier)") [6455](https://datatracker.ietf.org/doc/html/rfc6455) in 2011. The current specification allowing web applications to use this protocol is known as _WebSockets_.[[1]](https://en.wikipedia.org/wiki/WebSocket#cite_note-1) It is a living standard maintained by the [WHATWG](https://en.wikipedia.org/wiki/Web_Hypertext_Application_Technology_Working_Group "Web Hypertext Application Technology Working Group") and a successor to _The WebSocket API_ from the [W3C](https://en.wikipedia.org/wiki/World_Wide_Web_Consortium "World Wide Web Consortium").[[2]](https://en.wikipedia.org/wiki/WebSocket#cite_note-2)

---

## socket.io

---

## miraweb

## xebra.js
![](https://i.imgur.com/pukIk6g.png)

 note:Miraweb

Miraweb provides a responsive, websocket-based portal into your Max patch from any compatible browser. Just define a region of your Max UI to control, using the mira.frame object and point a browser to the provided URL to start interacting with the patch. Since it works in any browser with websocket support, you can use it with Android devices, iPhones, various laptops and multitouch-enabled computers on your home network. In our testing, we were delighted by how effortless and responsive it was. You’ll have to try it to believe it.
Xebra.js
content to just open a Max UI up to multi-platform browsers, our team is also opening up the websocket-driven technology used to do the heavy lifting in Miraweb. With [Xebra.js](https://github.com/Cycling74/xebra.js), our Open Source (MIT License) Javascript client library for communication with a Max patch, you can create your own event-based custom web interfaces. We’ve included lots of useful examples to get started, including [Miraweb](https://github.com/Cycling74/miraweb) itself, and [the API is fully documented](https://cycling74.github.io/xebra.js/). To put it more simply, Xebra.js lets you connect your own websites and web applications to a remote Max patch.
---

##  everything that can be done on desktop computers it will transfer into the browser

---
1

---


MIRAWEB < most simple *
P5 *
CABLES
TONE.jS *
WEB AUDIO API < most complex

