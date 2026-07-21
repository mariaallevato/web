# Web Maria Allevato

---


# ========================
#   Notas
# ========================

## Enviando mails sin backend
Un formulario HTML por sí solo no puede enviar un email. Necesita un servidor o un servicio que procese los datos. Tienes varias opciones:

Opción 1: FormSubmit (la más sencilla, sin backend)

Si tu web es estática, es probablemente la mejor opción.

Solo cambia tu formulario por algo así:

<form action="https://formsubmit.co/tucorreo@gmail.com" method="POST">
    <input type="text" name="nombre" placeholder="Nombre" required>

    <input type="email" name="email" placeholder="Email" required>

    <textarea name="mensaje" rows="5" placeholder="Mensaje" required></textarea>

    <button type="submit">Enviar</button>
</form>


La primera vez que alguien envíe el formulario, tendrás que confirmar tu dirección de correo. Después los mensajes llegarán directamente a tu email.

También puedes añadir campos ocultos:

<input type="hidden" name="_subject" value="Nuevo mensaje desde la web">
<input type="hidden" name="_captcha" value="false">
<input type="hidden" name="_next" value="https://tupagina.com/gracias.html">

Opción 2: EmailJS (todo desde JavaScript)

Ideal si no tienes servidor y quieres evitar que la página se recargue.

emailjs.send("service_id", "template_id", {
    nombre: nombre,
    email: email,
    mensaje: mensaje
});


Tiene un plan gratuito bastante generoso.

Opción 3: PHP (si tu hosting lo permite)

Si tu alojamiento soporta PHP:

<?php

$nombre = $_POST['nombre'];
$email = $_POST['email'];
$mensaje = $_POST['mensaje'];

mail(
    "tucorreo@gmail.com",
    "Nuevo mensaje desde la web",
    "Nombre: $nombre\nEmail: $email\n\n$mensaje"
);

?>


Y el formulario:

<form action="enviar.php" method="POST">

Opción 4: Node.js / Express

Si tienes un backend propio, normalmente se utiliza nodemailer para enviar correos mediante SMTP.

¿Cuál te recomiendo?

Si tu web es una página personal (como parece por el código que has mostrado) y no tienes backend, usaría FormSubmit porque:

✅ No necesitas programar un servidor.
✅ Es gratis para un uso normal.
✅ Funciona con cualquier hosting (GitHub Pages, Netlify, Vercel, hosting compartido, etc.).
✅ Solo cambias el action del formulario y listo.


---


## Solucionar problemas de encodificado `UTF-16`
El problema no era Apache, ni las rutas, ni el `<head>`.
Era **la codificación UTF-16**.

Te explico exactamente qué pasaba.

---

### Qué ocurre cuando guardas en UTF-16

UTF-16 guarda cada carácter usando **2 bytes** en vez de 1 (como UTF-8).

Por ejemplo:

* En UTF-8:

  ```
  <script>
  ```

  se guarda como texto normal.

* En UTF-16:
  cada letra va acompañada por bytes adicionales invisibles.

Cuando Apache sirve ese archivo, el navegador lo interpreta como:

```html
Content-Type: text/javascript
```

Pero el contenido realmente está en UTF-16.

Entonces el motor JavaScript intenta leer:

```
⸥⸥⸥<caracteres raros invisibles>
```

Y por eso aparece:

```
Uncaught SyntaxError: illegal character U+2E65
```

Ese U+2E65 era uno de esos bytes mal interpretados.

---

### Por qué el CSS parecía no cargar

Porque:

* El JS fallaba en la línea 1
* El navegador detenía la ejecución
* A veces se produce un render extraño o incompleto
* Además el mensaje que viste hablaba de carga antes de estilo (FOUC)

Pero el origen era el mismo: **archivo mal codificado**.

---

###  Por qué pasó al pegar código de ChatGPT

Cuando copias desde:

* Navegadores
* Word
* PDF
* Algunos editores

A veces VS Code detecta automáticamente la codificación como UTF-16 si el primer archivo estaba así.

No es culpa del código en sí, sino del formato en que se guardó el archivo.

---

### Regla profesional para proyectos web

Siempre usa:

```
UTF-8 (sin BOM)
```

En VS Code:

* Abajo a la derecha → Encoding
* Debe decir `UTF-8`
* Si dice `UTF-16 LE` o similar → cambiarlo

---

### Diferencia clave

| Codificación | ¿Funciona en web?                | Recomendado  |
| ------------ | -------------------------------- | ------------ |
| UTF-8        | ✅ Sí                             | ✅ Siempre    |
| UTF-8 BOM    | ⚠️ A veces problemas             | Mejor evitar |
| UTF-16       | ❌ Rompe JS en servidores comunes | No usar      |

---

### Por qué las imágenes sí cargaban

Porque las imágenes no se interpretan como texto.
El navegador las trata como binario puro.

Pero JS y CSS sí se interpretan como texto → ahí falla la codificación.

---

###  Resumen técnico real

Tu navegador estaba recibiendo:

* `Content-Type: text/javascript`
* Pero el contenido estaba en UTF-16
* El parser JS esperaba UTF-8
* Detectó bytes inválidos
* Lanzó `illegal character`
* La ejecución se detuvo

---

### ¿Por qué UTF-8 es el estándar web?

UTF-8 es el estándar porque:

* Es compatible con ASCII
* Es eficiente
* Es el encoding por defecto en HTTP moderno
* HTML5 asume UTF-8 si no se especifica otra cosa
* Todos los navegadores lo esperan

Además en tu HTML ya tenías:

```html
<meta charset="UTF-8">
```

Pero si el archivo estaba guardado físicamente como UTF-16, el navegador recibe bytes UTF-16 y el meta tag llega demasiado tarde.

El navegador ya empezó a interpretar el archivo antes de leer el `<meta>`.

---

### Cómo funciona realmente la detección de encoding

El orden real es:

1. Header HTTP `Content-Type`
2. BOM (si existe)
3. `<meta charset>`
4. Heurística del navegador

Si Apache no envía correctamente:

```
Content-Type: text/html; charset=UTF-8
```

Y el archivo tiene UTF-16, el navegador puede confundirse.

---

### Qué es “UTF-8 sin BOM” y por qué es lo ideal

En VS Code tienes dos opciones:

* UTF-8
* UTF-8 with BOM

Siempre usa:

```
UTF-8
```

(sin BOM)

Es el formato más limpio y el más compatible con:

* JS
* JSON
* PHP
* Node
* APIs
* Servidores Linux

---

### Cómo evitar esto en proyectos grandes

#### ✅ 1. Configura VS Code correctamente

En Settings:

```
"files.encoding": "utf8"
```

Y opcionalmente:

```
"files.autoGuessEncoding": false
```

---

#### ✅ 2. Añade configuración en tu servidor Apache

En el archivo `httpd.conf` o `.htaccess`:

```
AddDefaultCharset UTF-8
```

Eso fuerza a Apache a servir todo como UTF-8.

---

#### ✅ 3. Usa `.editorconfig` (muy profesional)

En la raíz del proyecto crea:

```
.editorconfig
```

Con:

```
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
```

Esto obliga a todos los editores compatibles a usar UTF-8.

---

#### ✅ 4. Verifica encoding antes de producción

En Linux puedes hacer:

```
file nombre.js
```

Y te dirá:

```
UTF-8 Unicode text
```

Si dice UTF-16 → mal.

---

### 7️⃣ ¿Por qué las imágenes no fallaban?

Porque:

* PNG, JPG, etc. son binarios
* No se interpretan como texto
* El encoding no afecta

JS, CSS y HTML sí son texto → ahí importa la codificación.

---

### Qué es FOUC (el mensaje que viste)

El mensaje que apareció:

> flash de contido non estilizado

Eso es FOUC (Flash Of Unstyled Content).

Ocurre cuando:

* El CSS tarda en cargarse
* O falla JS antes de aplicar clases
* O el render ocurre antes de aplicar estilos

En tu caso era un efecto secundario del error JS.

---

### 🧠 Resumen técnico real

Tu problema fue:

1. Archivo guardado como UTF-16
2. Apache lo servía como texto normal
3. Navegador lo interpretaba como UTF-8
4. Bytes inválidos → `illegal character`
5. JS se rompía
6. Render se veía afectado

---

# 🎯 Conclusión profesional

En desarrollo web moderno:

* Siempre UTF-8
* Nunca UTF-16
* Mejor sin BOM
* Fuerza encoding en editor y servidor

