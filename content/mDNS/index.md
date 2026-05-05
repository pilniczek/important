---
title: mDNS
---

### About

mDNS protocol resolves hostnames to IP addresses within small networks that do not include a local name server. 

When an mDNS client needs to resolve a hostname, it sends an IP multicast query message that asks the host having that name to identify itself. That target machine then multicasts a message that includes its IP address. All machines in that subnet can then use that information to update their mDNS caches. Any host can relinquish its claim to a name by sending a response packet with a time to live (TTL) equal to zero.

### How it works

- Client sends a formatted UDP packet to IPv4 address 224.0.0.251, port 5353.
- the address responds with list of local services (host name and service type)
- to connect to specific service, client sends multicast with corresponding host name to all  local services. The service with matching host name responds with multicast containing its IP address to the entire (local) network.
- UPD packet format: [https://tools.ietf.org/html/rfc6762#page-47](https://tools.ietf.org/html/rfc6762#page-47)

### Issues

There is no existing implementation of mDNS for web client-side. Browsers cannot send UDP packets.

### Existing solutions

For Chrome packaged apps ([https://chrome-apps-doc2.appspot.com/trunk/apps/about_apps.html](https://chrome-apps-doc2.appspot.com/trunk/apps/about_apps.html)) there exists an API for mDNS using browser. Google has however moved away from Chrome package apps and recommend the new PWA standard as substitute ([https://developers.chrome.com/apps/migration](https://developers.chrome.com/apps/migration)). Unfortunately, the mDNS API is not part of the migration to PWA standard.

### Experiments

[https://github.com/mdns-js/node-mdns-js](https://github.com/mdns-js/node-mdns-js) - does not work on browsers, the `dgram` library is missing there (responsible for creating UDP socket connection). I tried replacing the `dgram` inside the library's implementation with [https://www.npmjs.com/package/dgram-browserify](https://www.npmjs.com/package/dgram-browserify), but could not understand how that library works, as it still refers to `dgram`. 

[https://github.com/latysheff/node-sctp](https://github.com/latysheff/node-sctp) - alternative to create socket over UDP, not tested yet
