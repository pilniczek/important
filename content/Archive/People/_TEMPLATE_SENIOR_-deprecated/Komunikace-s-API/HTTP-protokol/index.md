---
title: HTTP protokol
---

Splňuje: No
Zjistili jsme: No

Zmíní nějaké základní hlavičky, třeba User-Agent a Content-Type

- Kdo posílá User-Agent - typicky prohlížeč, může obsahovat třeba verzi aplikace
- Content-Type - posílají oba, jak server (GET) tak prohlížeč (../POST/PUT/PATCH)

Zmíní rozdíl mezi HTTP 1 a HTTP 2

- Dvojka realizuje více dotazů v rámci jednoho TCP spojení. Možná dokáže říct i nevýhodu, což je, zahození celé komunikace v případě chyby v jednom dorazu
- Server push - server dokáže proaktivně poslat odpověď, na kterou se klient ještě nezeptal.
