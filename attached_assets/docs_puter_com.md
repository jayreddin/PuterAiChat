URL: http://docs.puter.com
---
## Puter.js

Puter.js brings serverless auth, cloud, and AI services directly to your browser-side JavaScript with no backend code or configuration required. Just include a single `<script>` tag and you can instantly use file storage, databases, GPT-4, DALL-E, and more right from your frontend code. Puter is forever free for developers!

https://super-magical-website.com


GPT-4o

Cloud Storage

Claude 3.5 Sonnet

DALL·E 3

NoSQL

<script src="https://js.puter.com/v2/"></script>

Publish web pages

Auth

UI Components

Text to Image

Text to Speech

Additionally, Puter.js works in a way that every user of your app will cover their own costs, so whether you have 1 user or 1 million users, your app won't cost you anything to run. In other words, Puter.js gives your app infinitely scalable Cloud and AI for free.

Puter.js is powered by [Puter](https://github.com/HeyPuter/puter), the open-source cloud operating system with a heavy focus on privacy. Puter does not use tracking technologies and does not monetize or even collect personal information.

## Examples

AI

Cloud Storage

NoSQL

Hosting

Auth

#### Write a file to the cloud

```html hljs language-xml
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        // Create a new file called "hello.txt" containing "Hello, world!"
        puter.fs.write('hello.txt', 'Hello, world!').then((file) => {
            puter.print(`File written successfully at: ${file.path}`);
        })
    </script>
</body>
</html>

```

**Read a file from the cloud**

```html hljs language-xml
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        (async () => {
            // (1) Create a random text file
            let filename = puter.randName() + ".txt";
            await puter.fs.write(filename, "Hello world! I'm a file!");
            puter.print(`"${filename}" created<br>`);

            // (2) Read the file and print its contents
            let blob = await puter.fs.read(filename);
            let content = await blob.text();
            puter.print(`"${filename}" read (content: "${content}")<br>`);
        })();
    </script>
</body>
</html>

```

#### Save user preference in the cloud Key-Value Store

```html hljs language-xml
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        // (1) Save user preference
        puter.kv.set('userPreference', 'darkMode').then(() => {
            // (2) Get user preference
            puter.kv.get('userPreference').then(value => {
                puter.print(`User preference: ${value}`);
            });
        })
    </script>
</body>
</html>

```

#### Chat with GPT-4o mini

```html hljs language-xml
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        // Chat with GPT-4o mini
        puter.ai.chat(`What is life?`).then(puter.print);
    </script>
</body>
</html>

```

**GPT-4 Vision**

```html hljs language-xml
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <img src="https://assets.puter.site/doge.jpeg" style="display:block;">
    <script>
        puter.ai.chat(
            `What do you see?`,
            `https://assets.puter.site/doge.jpeg`)
        .then(puter.print);
    </script>
</body>
</html>

```

**Generate an image of a cat using DALL·E 3**

```html hljs language-xml
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        // Generate an image of a cat using DALL·E 3. Please note that testMode is set to true so that you can test this code without using up API credits.
        puter.ai.txt2img('A picture of a cat.', true).then((image)=>{
            document.body.appendChild(image);
        });
    </script>
</body>
</html>

```

**Stream the response**

```html hljs language-xml
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
    (async () => {
        const resp = await puter.ai.chat('Tell me in detail what Rick and Morty is all about.', {model: 'claude', stream: true });
        for await ( const part of resp ) puter.print(part?.text?.replaceAll('\n', '<br>'));
    })();
    </script>
</body>
</html>

```

#### Publish a static website

```html hljs language-xml
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        (async () => {
            // (1) Create a random directory
            let dirName = puter.randName();
            await puter.fs.mkdir(dirName)

            // (2) Create 'index.html' in the directory with the contents "Hello, world!"
            await puter.fs.write(`${dirName}/index.html`, '<h1>Hello, world!</h1>');

            // (3) Host the directory under a random subdomain
            let subdomain = puter.randName();
            const site = await puter.hosting.create(subdomain, dirName)

            puter.print(`Website hosted at: <a href="https://${site.subdomain}.puter.site" target="_blank">https://${site.subdomain}.puter.site</a>`);
        })();
    </script>
</body>
</html>

```

#### Authenticate a user

```html hljs language-xml
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <button id="sign-in">Sign in</button>
    <script>
        // Because signIn() opens a popup window, it must be called from a user action.
        document.getElementById('sign-in').addEventListener('click', async () => {
            // signIn() will resolve when the user has signed in.
            await puter.auth.signIn().then((res) => {
                puter.print('Signed in<br>' + JSON.stringify(res));
            });
        });
    </script>
</body>
</html>

```

[NEXT\\
\\
Getting Started](https://docs.puter.com/getting-started/)