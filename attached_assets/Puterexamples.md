## [Tutorials](https://developer.puter.com/tutorials/)

# **Getting Started with Puter.js**

Puter.js adds serverless auth, cloud, and AI features directly to your frontend code. From cloud storage and database to GPT-4o and Sonnet 3.5, Puter.js has you covered. Sound amazing? well it gets even better, Puter.js is also 100% free forever and [open-source](https://github.com/heyputer/puter/)\!

This tutorial will guide you through the process of setting up and using Puter.js in your project to access its powerful features. Let's get started\!

## Installation

To begin using Puter.js, simply add it to your HTML file using the following script tag either in the \<head\> or \<body\> of your HTML file:

\<script src="https://js.puter.com/v2/"\>\</script\>

That's it\! You're now ready to start using Puter.js in your web application. No need to install any dependencies or set up a server. No API keys or configuration required.

## **Example 1**

## Add GPT-4o to your web application

Once you've added the Puter.js script to your web application, a global puter object will be available for you to use. This object contains all of the functionality provided by Puter.js. For example, to use GPT-4o mini, you can call the puter.ai.chat function:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        puter.ai.chat(\`Why did the chicken cross the road?\`).then(puter.print);  
    \</script\>  
\</body\>  
\</html\>

In this example, we're using the [puter.ai.chat](https://docs.puter.com/AI/chat/) function to generate text with GPT-4o. The generated text is then printed to the console using the [puter.print](https://docs.puter.com/Utils/print/) function. You can replace the input text with any prompt you'd like to generate text for.

## **Example 2**

## Add cloud storage to your web application

Let's try another example, this time using cloud storage to write and read a file:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        async function fileDemo() {  
            // Write a file  
            await puter.fs.write('hello.txt', 'Hello, Puter\!');  
            puter.print('File written successfully\<br\>');

            // Read the file  
            const fileContent \= await puter.fs.read('hello.txt');  
            puter.print('File content: ', await fileContent.text(), '\<br\>');  
        }

        fileDemo();  
    \</script\>  
\</body\>  
\</html\>

In this example, we're using the [puter.fs.write](https://docs.puter.com/FS/write/) function to write a file to the cloud storage. We then use the [puter.fs.read](https://docs.puter.com/FS/read/) function to read the file and print its content to the console. You can replace the file name and content with your own data.

## **Example 3**

## Cloud Key-Value Store

Let's use Puter.js to store and retrieve data from the cloud key-value store. In this example, we'll save a user preference to the cloud and then retrieve it:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        async function kvDemo() {  
            // Set a value  
            await puter.kv.set('user\_preference', 'dark\_mode');  
            puter.print('Preference saved\<br\>');

            // Get the value  
            const preference \= await puter.kv.get('user\_preference');  
            puter.print('User preference:', preference, '\<br\>');  
        }

        kvDemo();  
    \</script\>  
\</body\>  
\</html\>

In this example, we're using the [puter.kv.set](https://docs.puter.com/KV/set/) function to save a user preference to the cloud key-value store. We then use the [puter.kv.get](https://docs.puter.com/KV/get/) function to retrieve the preference and print it to the console. You can replace the key and value with your own data.

## **Example 4**

## Authentication

Puter.js handles authentication automatically. When your code tries to access any cloud services, the user will be prompted to sign in with their Puter.com account if they haven't already. You can build your app as if the user is already signed in, and Puter.js will handle the authentication process for you when needed.

If you want to explicitly check if a user is signed in or trigger the sign-in process, you can use the following methods:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        async function authDemo() {  
            // Check if user is signed in  
            const isSignedIn \= puter.auth.isSignedIn();  
            puter.print('Is user signed in? ', isSignedIn, '\<br\>');

            if (\!isSignedIn) {  
                // Trigger sign-in process  
                await puter.auth.signIn();  
                puter.print('User signed in successfully\<br\>');  
            }

            // Get user info  
            const user \= await puter.auth.getUser();  
            puter.print('User info:', JSON.stringify(user));  
        }

        authDemo();  
    \</script\>  
\</body\>  
\</html\>

This is all you need to use GPT-4o mini in your app. No backend code, no configuration, and no API keys. Just include the Puter.js script, and you're ready to start.

Puter.js offers many more features, including [hosting static websites](https://docs.puter.com/playground/?example=hosting-create), [generating images with DALL-E 3](https://docs.puter.com/playground/?example=ai-txt2img), and more. Explore the [Puter.js documentation](https://docs.puter.com/) to discover all the possibilities and start building powerful, serverless web applications with ease\! Remember, Puter.js is designed to be simple and straightforward, allowing you to focus on building your application without worrying about backend infrastructure or complex setups. Happy coding\!

—-------------------------------------------------------------------------------------------------------------

[Tutorials](https://developer.puter.com/tutorials/)

# **Free, Unlimited OpenAI API**

This tutorial will show you how to use Puter.js to access GPT-4o and DALL-E capabilities for free, without needing an OpenAI API key. Puter.js is completely free and open-source, allowing you to provide your users with powerful AI capabilities without any API keys or usage restrictions.

Puter is the pioneer of the "User Pays" model, which allows developers to incorporate AI capabilities into their applications while each user will cover their own usage costs. This model enables developers to access advanced AI capabilities for free, without any API keys or sign-ups.

## Getting Started

You can use puter.js without any API keys or sign-ups. To start using Puter.js, include the following script tag in your HTML file, either in the \<head\> or \<body\> section:

\<script src="https://js.puter.com/v2/"\>\</script\>

Nothing else is required to start using Puter.js for free access to GPT-4o and DALL-E capabilities.

## **Example 1**

## Use GPT-4o for text generation

To generate text using GPT-4o, use the [puter.ai.chat()](https://docs.puter.com/AI/chat/) function:

puter.ai.chat("What are the benefits of exercise?")  
    .then(response \=\> {  
        puter.print(response);  
    });

Full code example:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        puter.ai.chat("What are the benefits of exercise?")  
            .then(response \=\> {  
                puter.print(response);  
            });  
    \</script\>  
\</body\>  
\</html\>

## **Example 2**

## Generate images with DALL-E 3

To create images using DALL-E 3, use the [puter.ai.txt2img()](https://docs.puter.com/AI/txt2img/) function:

puter.ai.txt2img("A futuristic cityscape at night")  
    .then(imageElement \=\> {  
        document.body.appendChild(imageElement);  
    });

Full code example:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        puter.ai.txt2img("A futuristic cityscape at night")  
            .then(imageElement \=\> {  
                document.body.appendChild(imageElement);  
            });  
    \</script\>  
\</body\>  
\</html\>

## **Example 3**

## Analyze images with GPT-4o Vision

To analyze images using GPT-4o Vision, provide an image URL to [puter.ai.chat()](https://docs.puter.com/AI/chat/):

puter.ai.chat(  
    "What do you see in this image?",   
    "https://assets.puter.site/doge.jpeg"  
)  
.then(response \=\> {  
    puter.print(response);  
});

Full code example:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        puter.ai.chat(  
            "What do you see in this image?",   
            "https://assets.puter.site/doge.jpeg"  
        )  
        .then(response \=\> {  
            puter.print(response);  
        });  
    \</script\>  
\</body\>  
\</html\>

## **Example 4**

## Stream responses for longer queries

For longer responses, use streaming to get results in real-time:

async function streamResponse() {  
    const response \= await puter.ai.chat(  
        "Explain the theory of relativity in detail",   
        {stream: true}  
    );  
      
    for await (const part of response) {  
        puter.print(part?.text);  
    }  
}

streamResponse();

Full code example:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        async function streamResponse() {  
            const response \= await puter.ai.chat(  
                "Explain the theory of relativity in detail",   
                {stream: true}  
            );  
              
            for await (const part of response) {  
                puter.print(part?.text);  
            }  
        }

        streamResponse();  
    \</script\>  
\</body\>  
\</html\>

That's it\! You now have a free alternative to the OpenAI API using Puter.js. This allows you to access GPT-4o and DALL-E capabilities without needing an API key or managing usage limits.

—-------------------------------------------------------------------------------------------------

[Tutorials](https://developer.puter.com/tutorials/)

# **Free, Unlimited Claude 3.5 Sonnet API**

This tutorial will show you how to use Puter.js to access Claude 3.5 Sonnet capabilities for free, without any API keys or usage restrictions. Using Puter.js, you can generate text with Claude 3.5 Sonnet for a wide range of tasks, from creative writing to code generation and more without worrying about usage limits or costs.

Puter is the pioneer of the "User Pays" model, which allows developers to incorporate AI capabilities into their applications while users cover their own usage costs. This model enables developers to access advanced AI capabilities for free, without any API keys or sign-ups.

## Getting Started

Puter.js works without any API keys or sign-ups. To start using Puter.js, include the following script tag in your HTML file, either in the \<head\> or \<body\> section:

\<script src="https://js.puter.com/v2/"\>\</script\>

You're now ready to use Puter.js for free access to Claude 3.5 Sonnet capabilities. No API keys or sign-ups are required.

## **Example 1**

## Use Claude 3.5 Sonnet for text generation

To generate text using Claude 3.5 Sonnet, use the [puter.ai.chat()](https://docs.puter.com/AI/chat/) function with the 'claude-3-5-sonnet' model:

puter.ai.chat("Explain quantum computing in simple terms", {model: 'claude-3-5-sonnet'})  
    .then(response \=\> {  
        puter.print(response.message.content\[0\].text);  
    });

Here's the full code example:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        puter.ai.chat("Explain quantum computing in simple terms", {model: 'claude-3-5-sonnet'})  
            .then(response \=\> {  
                puter.print(response.message.content\[0\].text);  
            });  
    \</script\>  
\</body\>  
\</html\>

## **Example 2**

## Stream responses for longer queries

For longer responses, use streaming to get results in real-time:

async function streamClaudeResponse() {  
    const response \= await puter.ai.chat(  
        "Write a detailed essay on the impact of artificial intelligence on society",   
        {model: 'claude-3-5-sonnet', stream: true}  
    );  
      
    for await (const part of response) {  
        puter.print(part?.text);  
    }  
}

streamClaudeResponse();

Here's the full code example:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        async function streamClaudeResponse() {  
            const response \= await puter.ai.chat(  
                "Write a detailed essay on the impact of artificial intelligence on society",   
                {model: 'claude-3-5-sonnet', stream: true}  
            );  
              
            for await (const part of response) {  
                puter.print(part?.text);  
            }  
        }

        streamClaudeResponse();  
    \</script\>  
\</body\>  
\</html\>

That's it\! You now have free, unlimited access to Claude 3.5 Sonnet capabilities using Puter.js. This allows you to leverage Claude's advanced language understanding and generation abilities without worrying about API keys or usage limits.

—-------------------------------------------------------------------------------------------

[Tutorials](https://developer.puter.com/tutorials/)

# **Free, Unlimited DeepSeek API**

This tutorial will show you how to use Puter.js to access DeepSeek's powerful language models for free, without any API keys or usage restrictions. Using Puter.js, you can leverage both DeepSeek Chat and DeepSeek Reasoner for various tasks like text generation, analysis, and complex reasoning.

Puter is the pioneer of the "User Pays" model, which allows developers to incorporate AI capabilities into their applications while users cover their own usage costs. This model enables developers to access advanced AI capabilities for free, without any API keys or sign-ups.

## Getting Started

Puter.js works without any API keys or sign-ups. To start using Puter.js, include the following script tag in your HTML file, either in the \<head\> or \<body\> section:

\<script src="https://js.puter.com/v2/"\>\</script\>

You're now ready to use Puter.js for free access to DeepSeek capabilities. No API keys or sign-ups are required.

## **Example 1**

## Basic Text Generation with DeepSeek Chat

Here's a simple example showing how to generate text using DeepSeek Chat:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        puter.ai.chat("Explain quantum entanglement in simple terms", {  
            model: 'deepseek-chat'  
        }).then(response \=\> {  
            document.write(response.message.content);  
        });  
    \</script\>  
\</body\>  
\</html\>

## **Example 2**

## Complex Reasoning with DeepSeek Reasoner

DeepSeek Reasoner is particularly good at complex problem-solving and step-by-step analysis:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        puter.ai.chat(  
            "What would be the environmental impact of replacing all cars with electric vehicles? Consider both positive and negative effects.",   
            {  
                model: 'deepseek-reasoner'  
            }  
        ).then(response \=\> {  
            document.write(response.message.content);  
        });  
    \</script\>  
\</body\>  
\</html\>

## **Example 3**

## Streaming Responses

For longer responses, use streaming to get results in real-time:

\<html\>  
\<body\>  
    \<div id="output"\>\</div\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        async function streamResponse() {  
            const outputDiv \= document.getElementById('output');  
              
            // DeepSeek Chat with streaming  
            outputDiv.innerHTML \+= '\<h2\>DeepSeek Chat Response:\</h2\>';  
            const chatResponse \= await puter.ai.chat(  
                "Explain the significance of dark matter in the universe",   
                {  
                    model: 'deepseek-chat',  
                    stream: true  
                }  
            );  
              
            for await (const part of chatResponse) {  
                if (part?.text) {  
                    outputDiv.innerHTML \+= part.text;  
                }  
            }  
              
            // DeepSeek Reasoner with streaming  
            outputDiv.innerHTML \+= '\<h2\>DeepSeek Reasoner Response:\</h2\>';  
            const reasonerResponse \= await puter.ai.chat(  
                "Explain the significance of dark matter in the universe",   
                {  
                    model: 'deepseek-reasoner',  
                    stream: true  
                }  
            );  
              
            for await (const part of reasonerResponse) {  
                if (part?.text) {  
                    outputDiv.innerHTML \+= part.text;  
                }  
            }  
        }

        streamResponse();  
    \</script\>  
\</body\>  
\</html\>

## **Example 4**

## Comparing Models

Here's how to compare responses from both DeepSeek models:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
    (async () \=\> {  
        // DeepSeek Chat  
        const chat\_resp \= await puter.ai.chat(  
            'Solve this puzzle: If you have 9 coins and one is counterfeit (lighter), how can you identify it with just 2 weighings on a balance scale?',  
            {model: 'deepseek-chat', stream: true}  
        );  
        document.write('\<h2\>DeepSeek Chat Solution:\</h2\>');  
        for await (const part of chat\_resp) {  
            if (part?.text) {  
                document.write(part.text.replaceAll('\\n', '\<br\>'));  
            }  
        }

        // DeepSeek Reasoner  
        const reasoner\_resp \= await puter.ai.chat(  
            'Solve this puzzle: If you have 9 coins and one is counterfeit (lighter), how can you identify it with just 2 weighings on a balance scale?',  
            {model: 'deepseek-reasoner', stream: true}  
        );  
        document.write('\<h2\>DeepSeek Reasoner Solution:\</h2\>');  
        for await (const part of reasoner\_resp) {  
            if (part?.text) {  
                document.write(part.text.replaceAll('\\n', '\<br\>'));  
            }  
        }  
    })();  
    \</script\>  
\</body\>  
\</html\>

## Best Practices

1. Use streaming for longer responses to provide better user experience  
2. Consider the specific strengths of each model when choosing which to use  
3. Handle errors gracefully and provide feedback during processing  
4. Use appropriate error handling for network issues or API failures  
5. Consider implementing retry logic for failed requests

That's it\! You now have free access to DeepSeek's powerful language models using Puter.js. This allows you to add sophisticated AI capabilities to your web applications without worrying about API keys or usage limits.

—----------------------------------------------------------------------------------------------

[Tutorials](https://developer.puter.com/tutorials/)

# **Free Gemini API**

This tutorial will show you how to use Puter.js to access Gemini's powerful language models for free, without any API keys or usage restrictions. Using Puter.js, you can leverage both Gemini 2.0 Flash and Gemini 1.5 Flash for various tasks like text generation, analysis, and complex reasoning.

Puter is the pioneer of the "User Pays" model, which allows developers to incorporate AI capabilities into their applications while users cover their own usage costs. This model enables developers to access advanced AI capabilities for free, without any API keys or sign-ups.

## Getting Started

Puter.js works without any API keys or sign-ups. To start using Puter.js, include the following script tag in your HTML file, either in the \<head\> or \<body\> section:

\<script src="https://js.puter.com/v2/"\>\</script\>

You're now ready to use Puter.js for free access to Gemini capabilities. No API keys or sign-ups are required.

## **Example 1**

## Basic Text Generation with Gemini 2.0 Flash

Here's a simple example showing how to generate text using Gemini 2.0 Flash:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        puter.ai.chat("Explain the concept of black holes in simple terms", {  
            model: 'gemini-2.0-flash'  
        }).then(response \=\> {  
            document.write(response.message.content\[0\].text);  
        });  
    \</script\>  
\</body\>  
\</html\>

## **Example 2**

## Using Gemini 1.5 Flash

For comparison, here's how to use Gemini 1.5 Flash:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        puter.ai.chat(  
            "What are the major differences between renewable and non-renewable energy sources?",   
            {  
                model: 'gemini-1.5-flash'  
            }  
        ).then(response \=\> {  
            document.write(response.message.content\[0\].text);  
        });  
    \</script\>  
\</body\>  
\</html\>

## **Example 3**

## Streaming Responses

For longer responses, use streaming to get results in real-time:

\<html\>  
\<body\>  
    \<div id="output"\>\</div\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        async function streamResponses() {  
            const outputDiv \= document.getElementById('output');  
              
            // Gemini 2.0 Flash with streaming  
            outputDiv.innerHTML \+= '\<h2\>Gemini 2.0 Flash Response:\</h2\>';  
            const flash2Response \= await puter.ai.chat(  
                "Explain the process of photosynthesis in detail",   
                {  
                    model: 'gemini-2.0-flash',  
                    stream: true  
                }  
            );  
              
            for await (const part of flash2Response) {  
                if (part?.text) {  
                    outputDiv.innerHTML \+= part.text.replaceAll('\\n', '\<br\>');  
                }  
            }  
              
            // Gemini 1.5 Flash with streaming  
            outputDiv.innerHTML \+= '\<h2\>Gemini 1.5 Flash Response:\</h2\>';  
            const flash1Response \= await puter.ai.chat(  
                "Explain the process of photosynthesis in detail",   
                {  
                    model: 'gemini-1.5-flash',  
                    stream: true  
                }  
            );  
              
            for await (const part of flash1Response) {  
                if (part?.text) {  
                    outputDiv.innerHTML \+= part.text.replaceAll('\\n', '\<br\>');  
                }  
            }  
        }

        streamResponses();  
    \</script\>  
\</body\>  
\</html\>

## **Example 4**

## Comparing Models

Here's how to compare responses from both Gemini models:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
    (async () \=\> {  
        // Gemini 2.0 Flash  
        const flash2\_resp \= await puter.ai.chat(  
            'Tell me something interesting about quantum mechanics.',  
            {model: 'gemini-2.0-flash', stream: true}  
        );  
        document.write('\<h2\>Gemini 2.0 Flash Response:\</h2\>');  
        for await (const part of flash2\_resp) {  
            if (part?.text) {  
                document.write(part.text.replaceAll('\\n', '\<br\>'));  
            }  
        }

        // Gemini 1.5 Flash  
        const flash1\_resp \= await puter.ai.chat(  
            'Tell me something interesting about quantum mechanics.',  
            {model: 'gemini-1.5-flash', stream: true}  
        );  
        document.write('\<h2\>Gemini 1.5 Flash Response:\</h2\>');  
        for await (const part of flash1\_resp) {  
            if (part?.text) {  
                document.write(part.text.replaceAll('\\n', '\<br\>'));  
            }  
        }  
    })();  
    \</script\>  
\</body\>  
\</html\>

## Best Practices

1. Use streaming for longer responses to provide better user experience  
2. Choose the appropriate model based on your specific needs:  
   * Gemini 2.0 Flash for more advanced tasks and better reasoning  
   * Gemini 1.5 Flash for simpler tasks or when faster response times are priority  
3. Implement proper error handling for network issues  
4. Consider adding loading states for better user experience  
5. Use appropriate retry logic for failed requests

That's it\! You now have free access to Gemini's powerful language models using Puter.js. This allows you to add sophisticated AI capabilities to your web applications without worrying about API keys or usage limits.

—--------------------------------------------------------------------------------

## [Tutorials](https://developer.puter.com/tutorials/)

# **Free, Unlimited Text-to-Speech API**

This tutorial will show you how to use Puter.js to access text-to-speech capabilities similar to Amazon Polly for free, without any API keys or usage restrictions. Using Puter.js, you can convert text to speech for a wide range of applications without worrying about usage limits or costs.

## Getting Started

Using puter.js does not require any API keys or sign-ups. You can start using Puter.js by including the following script tag in your HTML file, either in the \<head\> or \<body\> section:

\<script src="https://js.puter.com/v2/"\>\</script\>

That's all you need to start using Puter.js for free text-to-speech conversion\! No API keys or sign-ups required.

## **Example 1**

## Use Puter.js for text-to-speech conversion

To convert text to speech using Puter.js, use the [puter.ai.txt2speech()](https://docs.puter.com/AI/chat/) function:

puter.ai.txt2speech("Hello, world\! This is text-to-speech using Puter.js.")  
    .then((audio) \=\> {  
        audio.play();  
    });

Here's a complete example with a text input and a button to trigger the text-to-speech conversion:

\<html\>  
\<body\>  
    \<textarea id="text-input" rows="4" cols="50"\>Hello, world\! This is text-to-speech using Puter.js.\</textarea\>  
    \<br\>  
    \<button id="speak-button"\>Speak\</button\>

    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        document.getElementById('speak-button').addEventListener('click', () \=\> {  
            const text \= document.getElementById('text-input').value;  
            puter.ai.txt2speech(text)  
                .then((audio) \=\> {  
                    audio.play();  
                })  
                .catch((error) \=\> {  
                    console.error('Error:', error);  
                });  
        });  
    \</script\>  
\</body\>  
\</html\>

## **Example 2**

## Customize the voice

Puter.js supports multiple languages and voices. You can specify the language when calling the [txt2speech](https://docs.puter.com/AI/txt2speech/) function:

puter.ai.txt2speech("Bonjour, le monde\!", "fr-FR")  
    .then((audio) \=\> {  
        audio.play();  
    });

Here's an example that allows users to select different languages:

\<html\>  
\<body\>  
    \<textarea id="text-input" rows="4" cols="50"\>Hello, world\!\</textarea\>  
    \<br\>  
    \<select id="language-select"\>  
        \<option value="en-US"\>English (US)\</option\>  
        \<option value="fr-FR"\>French\</option\>  
        \<option value="de-DE"\>German\</option\>  
        \<option value="es-ES"\>Spanish\</option\>  
        \<option value="it-IT"\>Italian\</option\>  
    \</select\>  
    \<button id="speak-button"\>Speak\</button\>

    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        document.getElementById('speak-button').addEventListener('click', () \=\> {  
            const text \= document.getElementById('text-input').value;  
            const language \= document.getElementById('language-select').value;  
            puter.ai.txt2speech(text, language)  
                .then((audio) \=\> {  
                    audio.play();  
                })  
                .catch((error) \=\> {  
                    console.error('Error:', error);  
                });  
        });  
    \</script\>  
\</body\>  
\</html\>

That's it\! You now have a free alternative to the Amazon Polly API using Puter.js. This allows you to add text-to-speech capabilities to your web applications without worrying about API keys or usage limits.

## Additional Features

Puter.js offers many more features, including cloud storage, hosting static websites, and AI-powered image generation. Explore the [Puter.js documentation](https://docs.puter.com/) to discover all the possibilities and start building powerful, serverless web applications with ease\!

—-------------------------------------------------------------

## [Tutorials](https://developer.puter.com/tutorials/)

# **Add a Cloud Key-Value Store to Your App: A Free Alternative to DynamoDB**

This tutorial will show you how to use Puter.js to add a key-value store to your web application, providing a free alternative to Amazon DynamoDB. With Puter.js, you can easily store and retrieve data without worrying about setting up a backend or managing a database.

## Getting Started

You can use Puter.js without any API keys or sign-ups. To start using Puter.js for key-value store operations, include the following script tag in your HTML file, either in the \<head\> or \<body\> section:

\<script src="https://js.puter.com/v2/"\>\</script\>

All set\! You can now start using Puter.js for key-value store operations without any additional setup.

## **Example 1**

## Basic Key-Value Operations

Let's start with the basic operations: setting a value, getting a value, and deleting a value.

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        (async () \=\> {  
            // Set a value  
            await puter.kv.set('user\_name', 'Alice');  
            puter.print('Value set\<br\>');

            // Get a value  
            const name \= await puter.kv.get('user\_name');  
            puter.print('Retrieved name:', name, '\<br\>');

            // Delete a value  
            await puter.kv.del('user\_name');  
            puter.print('Value deleted\<br\>');

            // Try to get the deleted value  
            const deletedName \= await puter.kv.get('user\_name');  
            puter.print('Deleted name:', deletedName, '\<br\>'); // Will be null  
        })();  
    \</script\>  
\</body\>  
\</html\>

The example above demonstrates how to use Puter.js to perform basic key-value operations. You can set a value with [puter.kv.set()](https://docs.puter.com/KV/set/), retrieve a value with [puter.kv.get()](https://docs.puter.com/KV/get/), and delete a value with [puter.kv.del()](https://docs.puter.com/KV/del/).

## **Example 2**

## Create a Simple User Profile Manager

Now, let's create a more practical example: a user profile manager that stores and retrieves user information.

\<html\>  
\<body\>  
    \<h1\>User Profile Manager\</h1\>  
    \<form id="profile-form"\>  
        \<input type="text" id="username" placeholder="Username" required\>  
        \<input type="email" id="email" placeholder="Email" required\>  
        \<input type="number" id="age" placeholder="Age" required\>  
        \<button type="submit"\>Save Profile\</button\>  
    \</form\>  
    \<button id="load-profile"\>Load Profile\</button\>  
    \<div id="profile-display"\>\</div\>

    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        const form \= document.getElementById('profile-form');  
        const loadButton \= document.getElementById('load-profile');  
        const display \= document.getElementById('profile-display');

        form.addEventListener('submit', async (e) \=\> {  
            e.preventDefault();  
            const username \= document.getElementById('username').value;  
            const email \= document.getElementById('email').value;  
            const age \= document.getElementById('age').value;

            const profile \= { email, age };  
            await puter.kv.set(\`user:${username}\`, JSON.stringify(profile));  
            alert('Profile saved\!');  
        });

        loadButton.addEventListener('click', async () \=\> {  
            const username \= document.getElementById('username').value;  
            const profileJson \= await puter.kv.get(\`user:${username}\`);  
              
            if (profileJson) {  
                const profile \= JSON.parse(profileJson);  
                display.innerHTML \= \`  
                    \<h2\>Profile for ${username}\</h2\>  
                    \<p\>Email: ${profile.email}\</p\>  
                    \<p\>Age: ${profile.age}\</p\>  
                \`;  
            } else {  
                display.innerHTML \= '\<p\>Profile not found\</p\>';  
            }  
        });  
    \</script\>  
\</body\>  
\</html\>

## **Example 3**

## Working with Multiple Keys

Puter.js also allows you to work with multiple keys at once. Let's create an example that demonstrates listing keys and batch operations.

\<html\>  
\<body\>  
    \<h1\>Product Inventory\</h1\>  
    \<form id="add-product"\>  
        \<input type="text" id="product-name" placeholder="Product Name" required\>  
        \<input type="number" id="product-price" placeholder="Price" required\>  
        \<button type="submit"\>Add Product\</button\>  
    \</form\>  
    \<button id="list-products"\>List Products\</button\>  
    \<button id="clear-inventory"\>Clear Inventory\</button\>  
    \<div id="product-list"\>\</div\>

    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        const addForm \= document.getElementById('add-product');  
        const listButton \= document.getElementById('list-products');  
        const clearButton \= document.getElementById('clear-inventory');  
        const productList \= document.getElementById('product-list');

        addForm.addEventListener('submit', async (e) \=\> {  
            e.preventDefault();  
            const name \= document.getElementById('product-name').value;  
            const price \= document.getElementById('product-price').value;

            await puter.kv.set(\`product:${name}\`, price);  
            alert('Product added\!');  
        });

        listButton.addEventListener('click', async () \=\> {  
            const products \= await puter.kv.list('product:\*', true);  
            productList.innerHTML \= '\<h2\>Products:\</h2\>';  
            products.forEach(product \=\> {  
                productList.innerHTML \+= \`\<p\>${product.key.split(':')\[1\]}: $${product.value}\</p\>\`;  
            });  
        });

        clearButton.addEventListener('click', async () \=\> {  
            const products \= await puter.kv.list('product:\*');  
            for (const key of products) {  
                await puter.kv.del(key);  
            }  
            alert('Inventory cleared\!');  
            productList.innerHTML \= '';  
        });  
    \</script\>  
\</body\>  
\</html\>

This example demonstrates how to use the [list](https://docs.puter.com/KV/list/) method to retrieve multiple keys matching a pattern, and how to perform batch operations by iterating over the results.

## **Example 4**

## Atomic Operations

Puter.js also supports atomic increment and decrement operations, which are useful for counters or any numeric values that need to be updated concurrently.

\<html\>  
\<body\>  
    \<h1\>Visit Counter\</h1\>  
    \<p\>This page has been visited \<span id="visit-count"\>0\</span\> times.\</p\>  
    \<button id="reset-count"\>Reset Count\</button\>

    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        const countDisplay \= document.getElementById('visit-count');  
        const resetButton \= document.getElementById('reset-count');

        async function updateVisitCount() {  
            const count \= await puter.kv.incr('visit\_count');  
            countDisplay.textContent \= count;  
        }

        resetButton.addEventListener('click', async () \=\> {  
            await puter.kv.set('visit\_count', '0');  
            countDisplay.textContent \= '0';  
        });

        updateVisitCount();  
    \</script\>  
\</body\>  
\</html\>

This example uses the [incr](https://docs.puter.com/KV/incr/) method to atomically increment a counter, ensuring accurate counts even with concurrent updates. That's it\!

You now have a free alternative to DynamoDB using Puter.js. This allows you to add key-value store capabilities to your web applications without worrying about setting up a backend or managing a database.

—----------------------------------------------------------------------------------

## [Tutorials](https://developer.puter.com/tutorials/)

# **Add Upload to Your Website for Free**

This tutorial will show you how to use Puter.js to add file upload capabilities to your web application for free, without any backend or server setup. Using Puter.js, you can easily allow users to upload files to cloud storage directly from their browser. Puter.js can serve as a powerful, free alternative to traditional file upload solutions such as Amazon S3, Google Cloud Storage, Firebase Storage, or custom server-side implementations.

## Getting Started

Puter.js works out of the box without any additional setup or configuration. To start using Puter.js for file uploads, you only need to include the Puter.js script in your HTML file, either in the \<head\> or \<body\> section:

\<script src="https://js.puter.com/v2/"\>\</script\>

That's it\! You're now ready to add file upload capabilities to your website using Puter.js. No need to set up a server, manage storage, or worry about API keys.

## **Example 1**

## Basic File Upload

Let's start with a simple example that allows users to upload a single file. This example demonstrates how to use Puter.js to perform basic file uploads. You can select a file using the file input, and then click the "Upload" button to upload it to the cloud storage:

\<html\>  
\<body\>  
    \<input type="file" id="file-input"\>  
    \<button id="upload-button"\>Upload\</button\>  
    \<div id="result"\>\</div\>

    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        document.getElementById('upload-button').addEventListener('click', async () \=\> {  
            const fileInput \= document.getElementById('file-input');  
            const resultDiv \= document.getElementById('result');

            if (fileInput.files.length \> 0\) {  
                try {  
                    const uploadedFile \= await puter.fs.upload(fileInput.files);  
                    resultDiv.innerHTML \= \`File uploaded successfully\! Path: ${uploadedFile.path}\`;  
                } catch (error) {  
                    resultDiv.innerHTML \= \`Error uploading file: ${error.message}\`;  
                }  
            } else {  
                resultDiv.innerHTML \= 'Please select a file to upload.';  
            }  
        });  
    \</script\>  
\</body\>  
\</html\>

Let's break down the code:

\<input type="file" id="file-input"\>

This creates a standard file input field that allows users to select files from their device. The 'file' type specifically enables file selection functionality.

\<button id="upload-button"\>Upload\</button\>

This creates a clickable button that will trigger our upload process.

\<div id="result"\>\</div\>

This empty div will be used to display feedback to the user about the upload process \- success messages, errors, or instructions.

\<script src="https://js.puter.com/v2/"\>\</script\>

This line imports the Puter.js library, giving us access to all its file handling and cloud storage capabilities.

Now for the JavaScript:

document.getElementById('upload-button').addEventListener('click', async () \=\> {

This sets up an event listener on our upload button. The async keyword is necessary because file uploads are asynchronous operations.

const fileInput \= document.getElementById('file-input');  
const resultDiv \= document.getElementById('result');

These lines get references to our HTML elements so we can access the selected file and update the result message.

if (fileInput.files.length \> 0\) {

This checks if the user has actually selected any files. The files property is an array-like object containing all selected files.

const uploadedFile \= await puter.fs.upload(fileInput.files);

This is where the actual upload happens. The puter.fs.upload() method handles the entire upload process to Puter's cloud storage. The await keyword makes our code wait for the upload to complete before continuing.

resultDiv.innerHTML \= \`File uploaded successfully\! Path: ${uploadedFile.path}\`;

After a successful upload, this displays a success message showing where the file was stored in the cloud. The uploadedFile.path gives us the file's location in Puter's storage system.

} catch (error) {  
    resultDiv.innerHTML \= \`Error uploading file: ${error.message}\`;  
}

This error handling code catches any problems during the upload (like network issues or file size limits) and displays the error message to the user.

} else {  
    resultDiv.innerHTML \= 'Please select a file to upload.';  
}

If the user clicks upload without selecting a file, this provides feedback asking them to select a file first.

That's it\! You now have a free and powerful file upload solution using Puter.js. This allows you to add file upload capabilities to your web applications without worrying about server-side implementation or storage costs.

## Additional Features

Puter.js offers many more features, including [cloud database](https://developer.puter.com/tutorials/add-a-cloud-key-value-store-to-your-app-a-free-alternative-to-dynamodb), hosting static websites, and [AI-powered services](https://developer.puter.com/tutorials/free-unlimited-openai-api). Explore the [Puter.js documentation](https://docs.puter.com/) to discover all the possibilities and start building powerful, serverless web applications with ease\!

—--------------------------------------------------------------

## [Tutorials](https://developer.puter.com/tutorials/)

# **Free, Unlimited Auth API**

This tutorial will show you how to implement user authentication in your web applications using Puter.js, completely free and without any API keys or usage restrictions. Using Puter.js, you can add secure user authentication to your applications without managing servers, databases, or authentication providers.

## Getting Started

Puter.js works without any API keys or sign-ups. To start using Puter.js, include the following script tag in your HTML file, either in the \<head\> or \<body\> section:

\<script src="https://js.puter.com/v2/"\>\</script\>

You're now ready to use Puter.js for free authentication capabilities. No API keys or sign-ups are required.

## **Example 1**

## Basic Authentication Flow

Here's a simple example showing how to implement a sign-in button and handle authentication:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<button id="sign-in"\>Sign in\</button\>  
    \<div id="user-info"\>\</div\>

    \<script\>  
        // Get the sign in button  
        const signInButton \= document.getElementById('sign-in');  
        const userInfoDiv \= document.getElementById('user-info');

        // Add click event listener to the sign in button  
        signInButton.addEventListener('click', async () \=\> {  
            try {  
                // Attempt to sign in  
                await puter.auth.signIn();  
                  
                // Get user information after successful sign in  
                const user \= await puter.auth.getUser();  
                userInfoDiv.innerHTML \= \`Welcome, ${user.username}\!\`;  
                  
                // Hide the sign in button  
                signInButton.style.display \= 'none';  
            } catch (error) {  
                console.error('Sign in failed:', error);  
            }  
        });  
    \</script\>  
\</body\>  
\</html\>

## **Example 2**

## Check Authentication Status

You can check if a user is already signed in using the [isSignedIn()](https://docs.puter.com/Auth/isSignedIn/) method:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<div id="status"\>\</div\>  
    \<button id="sign-in" style="display: none;"\>Sign in\</button\>  
    \<button id="sign-out" style="display: none;"\>Sign out\</button\>

    \<script\>  
        const statusDiv \= document.getElementById('status');  
        const signInButton \= document.getElementById('sign-in');  
        const signOutButton \= document.getElementById('sign-out');

        // Function to update UI based on auth state  
        async function updateAuthUI() {  
            if (puter.auth.isSignedIn()) {  
                const user \= await puter.auth.getUser();  
                statusDiv.textContent \= \`Signed in as: ${user.username}\`;  
                signInButton.style.display \= 'none';  
                signOutButton.style.display \= 'block';  
            } else {  
                statusDiv.textContent \= 'Not signed in';  
                signInButton.style.display \= 'block';  
                signOutButton.style.display \= 'none';  
            }  
        }

        // Set up event listeners  
        signInButton.addEventListener('click', async () \=\> {  
            await puter.auth.signIn();  
            updateAuthUI();  
        });

        signOutButton.addEventListener('click', () \=\> {  
            puter.auth.signOut();  
            updateAuthUI();  
        });

        // Check initial auth state  
        updateAuthUI();  
    \</script\>  
\</body\>  
\</html\>

## **Example 3**

## Protected Content

Here's how to create a simple application with protected content that's only visible to authenticated users:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<div id="public-content"\>  
        \<h1\>Welcome to Our App\</h1\>  
        \<p\>Please sign in to view protected content.\</p\>  
        \<button id="sign-in"\>Sign in\</button\>  
    \</div\>

    \<div id="protected-content" style="display: none;"\>  
        \<h1\>Protected Content\</h1\>  
        \<p\>Welcome to the protected area of our application\!\</p\>  
        \<button id="sign-out"\>Sign out\</button\>  
    \</div\>

    \<script\>  
        const publicContent \= document.getElementById('public-content');  
        const protectedContent \= document.getElementById('protected-content');  
        const signInButton \= document.getElementById('sign-in');  
        const signOutButton \= document.getElementById('sign-out');

        async function updateUI() {  
            if (puter.auth.isSignedIn()) {  
                publicContent.style.display \= 'none';  
                protectedContent.style.display \= 'block';  
            } else {  
                publicContent.style.display \= 'block';  
                protectedContent.style.display \= 'none';  
            }  
        }

        signInButton.addEventListener('click', async () \=\> {  
            await puter.auth.signIn();  
            updateUI();  
        });

        signOutButton.addEventListener('click', () \=\> {  
            puter.auth.signOut();  
            updateUI();  
        });

        // Check initial auth state  
        updateUI();  
    \</script\>  
\</body\>  
\</html\>

## **Example 4**

## Combining Auth with Cloud Storage

Here's an example that combines authentication with cloud storage to create a simple personal notes application:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<div id="auth-container"\>  
        \<button id="sign-in"\>Sign in to access your notes\</button\>  
    \</div\>

    \<div id="notes-container" style="display: none;"\>  
        \<h2\>My Notes\</h2\>  
        \<textarea id="note-content" rows="10" cols="50"\>\</textarea\>  
        \<br\>  
        \<button id="save-note"\>Save Note\</button\>  
        \<button id="sign-out"\>Sign out\</button\>  
    \</div\>

    \<script\>  
        const authContainer \= document.getElementById('auth-container');  
        const notesContainer \= document.getElementById('notes-container');  
        const noteContent \= document.getElementById('note-content');  
        const saveNoteButton \= document.getElementById('save-note');  
        const signInButton \= document.getElementById('sign-in');  
        const signOutButton \= document.getElementById('sign-out');

        async function loadNote() {  
            try {  
                const blob \= await puter.fs.read('my-note.txt');  
                const text \= await blob.text();  
                noteContent.value \= text;  
            } catch (error) {  
                // File doesn't exist yet, that's okay  
                noteContent.value \= '';  
            }  
        }

        async function saveNote() {  
            await puter.fs.write('my-note.txt', noteContent.value);  
            alert('Note saved\!');  
        }

        async function updateUI() {  
            if (puter.auth.isSignedIn()) {  
                authContainer.style.display \= 'none';  
                notesContainer.style.display \= 'block';  
                await loadNote();  
            } else {  
                authContainer.style.display \= 'block';  
                notesContainer.style.display \= 'none';  
            }  
        }

        signInButton.addEventListener('click', async () \=\> {  
            await puter.auth.signIn();  
            updateUI();  
        });

        signOutButton.addEventListener('click', () \=\> {  
            puter.auth.signOut();  
            updateUI();  
        });

        saveNoteButton.addEventListener('click', saveNote);

        // Check initial auth state  
        updateUI();  
    \</script\>  
\</body\>  
\</html\>

That's it\! You now have a free and unlimited authentication system using Puter.js. This allows you to add secure user authentication to your web applications without managing servers or worrying about usage limits.

## Best Practices

When implementing authentication in your web applications with Puter.js, always verify the authentication status before displaying protected content. This can be done using the [isSignedIn()](https://docs.puter.com/Auth/isSignedIn/) method at key points in your application flow.

Your application should handle authentication errors gracefully and provide clear feedback to users when authentication fails. It's crucial to update your UI immediately after any authentication state changes to maintain a consistent user experience.

Consider building on top of the authentication system by combining it with other Puter.js features. For example, you might use cloud storage to save user preferences or leverage the AI capabilities to provide personalized experiences for authenticated users.

—--------------------------------------------------------

## [Tutorials](https://developer.puter.com/tutorials/)

# **Free, Unlimited Cloud Save API for Games**

Want to add cloud saves to your game without the hassle of managing servers or databases or paying for proprietary services? With Puter.js, you can save player progress, game states, and more to the cloud for free, without any API keys or usage limits. This tutorial will show you how to use Puter.js to implement a cloud save system for your web games.

## Getting Started

Add Puter.js to your game with a single line:

\<script src="https://js.puter.com/v2/"\>\</script\>

That's it \- you're ready to start saving game data to the cloud.

## **Example 1**

## Simple Save/Load System

Let's start with a basic save/load system for a game:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
      
    \<\!-- Simple game UI \--\>  
    \<div\>  
        \<h3\>Player Stats\</h3\>  
        \<p\>Gold: \<span id="gold"\>0\</span\>\</p\>  
        \<p\>Level: \<span id="level"\>1\</span\>\</p\>  
          
        \<button onclick="addGold()"\>Get Gold\</button\>  
        \<button onclick="levelUp()"\>Level Up\</button\>  
        \<br\>\<br\>  
        \<button onclick="saveGame()"\>Save Game\</button\>  
        \<button onclick="loadGame()"\>Load Game\</button\>  
    \</div\>

    \<script\>  
        // Game state  
        let playerData \= {  
            gold: 0,  
            level: 1,  
            lastSaved: null  
        };

        // Game actions  
        function addGold() {  
            playerData.gold \+= 10;  
            updateUI();  
        }

        function levelUp() {  
            playerData.level \+= 1;  
            updateUI();  
        }

        function updateUI() {  
            document.getElementById('gold').textContent \= playerData.gold;  
            document.getElementById('level').textContent \= playerData.level;  
        }

        // Save game data  
        async function saveGame() {  
            try {  
                playerData.lastSaved \= new Date().toISOString();  
                await puter.kv.set('gameData', JSON.stringify(playerData));  
                alert('Game saved\!');  
            } catch (error) {  
                alert('Failed to save: ' \+ error);  
            }  
        }

        // Load game data  
        async function loadGame() {  
            try {  
                const saved \= await puter.kv.get('gameData');  
                if (saved) {  
                    playerData \= JSON.parse(saved);  
                    updateUI();  
                    alert('Game loaded\!');  
                } else {  
                    alert('No saved game found');  
                }  
            } catch (error) {  
                alert('Failed to load: ' \+ error);  
            }  
        }  
    \</script\>  
\</body\>  
\</html\>

This first example demonstrates the basics of saving and loading game data. The code maintains a simple game state with gold and level variables, storing them in Puter's key-value store. When a player clicks "Save Game", their current progress is converted to JSON and stored in the cloud with a timestamp. The "Load Game" button retrieves this data and restores their progress.

Key points about this example:

* Game state is kept in a single object, making it easy to save and load  
* The lastSaved timestamp helps track when the game was last saved  
* Data is stored using [puter.kv.set()](https://docs.puter.com/KV/set/) which handles all the cloud storage details  
* JSON is used to convert the game state to a format that can be stored

## **Example 2**

## Auto-Save System

Here's how to implement an auto-save system that saves after important actions:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
      
    \<div\>  
        \<h3\>RPG Character\</h3\>  
        \<p\>Health: \<span id="health"\>100\</span\>\</p\>  
        \<p\>Experience: \<span id="xp"\>0\</span\>\</p\>  
          
        \<button onclick="gainXP()"\>Gain XP\</button\>  
        \<button onclick="heal()"\>Heal\</button\>  
        \<p id="save-status"\>\</p\>  
    \</div\>

    \<script\>  
        let gameState \= {  
            health: 100,  
            xp: 0  
        };

        let saveTimeout;  
        const SAVE\_DELAY \= 2000; // Wait 2 seconds after last action

        function updateUI() {  
            document.getElementById('health').textContent \= gameState.health;  
            document.getElementById('xp').textContent \= gameState.xp;  
        }

        function setSaveStatus(message) {  
            document.getElementById('save-status').textContent \= message;  
        }

        // Schedule an auto-save  
        function scheduleAutoSave() {  
            clearTimeout(saveTimeout);  
            setSaveStatus('Waiting to save...');  
              
            saveTimeout \= setTimeout(async () \=\> {  
                try {  
                    await puter.kv.set('autoSave', JSON.stringify(gameState));  
                    setSaveStatus('Game saved automatically\!');  
                } catch (error) {  
                    setSaveStatus('Auto-save failed\!');  
                }  
            }, SAVE\_DELAY);  
        }

        // Game actions  
        function gainXP() {  
            gameState.xp \+= 10;  
            updateUI();  
            scheduleAutoSave();  
        }

        function heal() {  
            gameState.health \= 100;  
            updateUI();  
            scheduleAutoSave();  
        }

        // Load last auto-save when game starts  
        async function loadLastGame() {  
            try {  
                const saved \= await puter.kv.get('autoSave');  
                if (saved) {  
                    gameState \= JSON.parse(saved);  
                    updateUI();  
                    setSaveStatus('Previous game loaded\!');  
                }  
            } catch (error) {  
                setSaveStatus('Could not load previous game');  
            }  
        }

        loadLastGame();  
    \</script\>  
\</body\>  
\</html\>

The auto-save system builds on the basic save/load functionality by automatically saving after player actions. Instead of saving immediately after every action, it uses a delay timer to prevent excessive saves. This is particularly useful for games where players make frequent actions.

The auto-save implementation demonstrates several important concepts:

* Uses a timeout to batch multiple quick actions into a single save  
* Provides visual feedback about the save status  
* Automatically loads the previous game state when starting  
* Saves after meaningful actions rather than at fixed intervals

This approach is ideal for RPGs, adventure games, or any game where losing progress would be frustrating for players.

## **Example 3**

## Save Multiple Characters

Here's how to implement multiple character saves:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
      
    \<div\>  
        \<h3\>Character Selection\</h3\>  
        \<div id="character-list"\>\</div\>  
        \<br\>  
        \<button onclick="createCharacter()"\>New Character\</button\>  
          
        \<div id="active-character" style="display: none"\>  
            \<h3\>Playing as: \<span id="char-name"\>\</span\>\</h3\>  
            \<p\>Power: \<span id="power"\>1\</span\>\</p\>  
            \<button onclick="increasePower()"\>Train\</button\>  
            \<button onclick="saveCharacter()"\>Save\</button\>  
        \</div\>  
    \</div\>

    \<script\>  
        let currentChar \= null;

        async function loadCharacters() {  
            const charList \= document.getElementById('character-list');  
            charList.innerHTML \= 'Loading characters...';

            try {  
                // Get list of all character saves  
                const chars \= await puter.kv.list('char\_\*');  
                  
                if (chars.length \=== 0\) {  
                    charList.innerHTML \= 'No characters found';  
                    return;  
                }

                // Create buttons for each character  
                charList.innerHTML \= chars  
                    .map(charKey \=\> {  
                        const name \= charKey.replace('char\_', '');  
                        return \`  
                            \<button onclick="loadCharacter('${name}')"\>  
                                Play as ${name}  
                            \</button\>  
                            \<button onclick="deleteCharacter('${name}')"\>  
                                ❌  
                            \</button\>  
                            \<br\>\<br\>  
                        \`;  
                    })  
                    .join('');  
            } catch (error) {  
                charList.innerHTML \= 'Failed to load characters';  
            }  
        }

        async function createCharacter() {  
            const name \= prompt('Enter character name:');  
            if (\!name) return;

            const newChar \= {  
                name: name,  
                power: 1,  
                created: Date.now()  
            };

            try {  
                await puter.kv.set(\`char\_${name}\`, JSON.stringify(newChar));  
                loadCharacters();  
            } catch (error) {  
                alert('Failed to create character');  
            }  
        }

        async function loadCharacter(name) {  
            try {  
                const charData \= await puter.kv.get(\`char\_${name}\`);  
                if (charData) {  
                    currentChar \= JSON.parse(charData);  
                    updateCharacterUI();  
                }  
            } catch (error) {  
                alert('Failed to load character');  
            }  
        }

        function updateCharacterUI() {  
            const activeDiv \= document.getElementById('active-character');  
            activeDiv.style.display \= 'block';  
            document.getElementById('char-name').textContent \= currentChar.name;  
            document.getElementById('power').textContent \= currentChar.power;  
        }

        async function saveCharacter() {  
            if (\!currentChar) return;  
              
            try {  
                await puter.kv.set(\`char\_${currentChar.name}\`, JSON.stringify(currentChar));  
                alert('Character saved\!');  
            } catch (error) {  
                alert('Failed to save character');  
            }  
        }

        function increasePower() {  
            if (\!currentChar) return;  
            currentChar.power++;  
            updateCharacterUI();  
        }

        async function deleteCharacter(name) {  
            if (confirm(\`Really delete ${name}?\`)) {  
                await puter.kv.del(\`char\_${name}\`);  
                loadCharacters();  
            }  
        }

        // Initialize by loading character list  
        loadCharacters();  
    \</script\>  
\</body\>  
\</html\>

This example shows how to manage multiple save files \- in this case, different character saves. It demonstrates a complete character management system where players can create, load, save, and delete different characters. This pattern is common in RPGs and other games where players might want to maintain multiple playthroughs.

The multiple character system showcases several advanced techniques:

* Uses a prefix ('char\_') to organize related saves in the key-value store  
* Implements a complete UI for character management  
* Demonstrates how to list and delete saves  
* Shows how to handle active character state separately from saved data

This approach can be adapted for other types of multiple save systems, such as save slots or different game worlds.

## Quick Implementation Tips

1. Always check for data validity when loading saves \- use try/catch blocks and verify data structure.  
2. Save timestamps with your game data to show players when they last saved.  
3. For large save files (like complete game worlds), use [puter.fs.write()](https://docs.puter.com/FS/write/) instead of puter.kv.  
4. Implement auto-saves after important game events, not on a timer.  
5. Keep save data small by only storing essential information.

## Advanced Features

For larger games, consider using these additional features:

// Save file versioning  
const saveData \= {  
    version: "1.0",  
    player: playerState,  
    timestamp: Date.now()  
};

// Compress large saves  
const compressed \= btoa(JSON.stringify(saveData));  
await puter.kv.set('gameSave', compressed);

// Multiple save slots  
await puter.kv.set(\`save\_slot\_${slotNumber}\`, saveData);

—-------------------------------

## [Tutorials](https://developer.puter.com/tutorials/)

# **Free, Unlimited OCR API**

Need to extract text from images in your web application? Whether you're building a document scanner, digitizing receipts and business cards, or converting handwritten notes to text, this tutorial shows you how to implement OCR (Optical Character Recognition) using Puter.js. Best of all, it's completely free with no usage restrictions \- no API keys or backend required.

## Getting Started

Add Puter.js to your project with a single line:

\<script src="https://js.puter.com/v2/"\>\</script\>

That's it \- you're ready to start extracting text from images.

## **Example 1**

## Basic Image to Text

Here's a simple example that extracts text from an image URL:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
      
    \<div\>  
        \<h3\>Image to Text Converter\</h3\>  
        \<input type="text" id="image-url" placeholder="Enter image URL"   
               value="https://cdn.handwrytten.com/www/2020/02/home-hero-photo2%402x.png"\>  
        \<button onclick="extractText()"\>Extract Text\</button\>  
        \<div id="result" style="margin-top: 20px; white-space: pre-wrap;"\>\</div\>  
    \</div\>

    \<script\>  
        async function extractText() {  
            const imageUrl \= document.getElementById('image-url').value;  
            const resultDiv \= document.getElementById('result');  
              
            resultDiv.textContent \= 'Processing image...';  
              
            try {  
                const text \= await puter.ai.img2txt(imageUrl);  
                resultDiv.textContent \= text || 'No text found in image';  
            } catch (error) {  
                resultDiv.textContent \= 'Error: ' \+ error.message;  
            }  
        }  
    \</script\>  
\</body\>  
\</html\>

This basic example demonstrates how to extract text from an image URL. Simply input the URL of an image containing text, and Puter.js will process it and return any text it finds.

## **Example 2**

## File Upload OCR

Here's how to handle OCR for uploaded image files:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
      
    \<div\>  
        \<h3\>OCR File Upload\</h3\>  
        \<input type="file" id="image-input" accept="image/\*"\>  
        \<button onclick="processImage()"\>Process Image\</button\>  
          
        \<div style="margin-top: 20px;"\>  
            \<h4\>Preview:\</h4\>  
            \<img id="preview" style="max-width: 500px; display: none;"\>  
        \</div\>  
          
        \<div style="margin-top: 20px;"\>  
            \<h4\>Extracted Text:\</h4\>  
            \<div id="result" style="white-space: pre-wrap;"\>\</div\>  
        \</div\>  
    \</div\>

    \<script\>  
        const imageInput \= document.getElementById('image-input');  
        const preview \= document.getElementById('preview');  
        const result \= document.getElementById('result');

        imageInput.addEventListener('change', function(e) {  
            const file \= e.target.files\[0\];  
            if (file) {  
                // Show image preview  
                preview.src \= URL.createObjectURL(file);  
                preview.style.display \= 'block';  
                result.textContent \= ''; // Clear previous result  
            }  
        });

    async function processImage() {  
        const file \= imageInput.files\[0\];  
        if (\!file) {  
            alert('Please select an image first');  
            return;  
        }

        result.textContent \= 'Processing image...';  
          
        try {  
            // Convert file to data URL  
            const dataUrl \= await new Promise((resolve) \=\> {  
                const reader \= new FileReader();  
                reader.onload \= () \=\> resolve(reader.result);  
                reader.readAsDataURL(file);  
            });  
              
            // Now pass the data URL to img2txt  
            const text \= await puter.ai.img2txt(dataUrl);  
            result.textContent \= text || 'No text found in image';  
        } catch (error) {  
            result.textContent \= 'Error: ' \+ error.message;  
        }  
    }     
    \</script\>  
\</body\>  
\</html\>

This example shows how to handle file uploads for OCR. It includes an image preview feature and processes local image files directly. The OCR function works with File objects just as easily as with URLs.

## **Example 3**

## Batch OCR Processing

Here's an example that processes multiple images and saves the results:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
      
    \<div\>  
        \<h3\>Batch OCR Processing\</h3\>  
        \<input type="file" id="image-input" accept="image/\*" multiple\>  
        \<button onclick="processBatch()"\>Process All Images\</button\>  
          
        \<div id="progress"\>\</div\>  
          
        \<div style="margin-top: 20px;"\>  
            \<h4\>Results:\</h4\>  
            \<div id="results"\>\</div\>  
        \</div\>  
          
        \<button onclick="saveResults()" id="save-button" style="display: none;"\>  
            Save Results  
        \</button\>  
    \</div\>

    \<script\>  
        let processedResults \= \[\];

        // Convert File to data URL  
        function fileToDataURL(file) {  
            return new Promise((resolve) \=\> {  
                const reader \= new FileReader();  
                reader.onload \= () \=\> resolve(reader.result);  
                reader.readAsDataURL(file);  
            });  
        }

        async function processBatch() {  
            const files \= document.getElementById('image-input').files;  
            if (files.length \=== 0\) {  
                alert('Please select some images first');  
                return;  
            }

            const progress \= document.getElementById('progress');  
            const results \= document.getElementById('results');  
            results.innerHTML \= '';  
            processedResults \= \[\];

            for (let i \= 0; i \< files.length; i++) {  
                const file \= files\[i\];  
                progress.textContent \= \`Processing image ${i \+ 1} of ${files.length}...\`;

                try {  
                    // Convert to data URL first  
                    const dataUrl \= await fileToDataURL(file);  
                    const text \= await puter.ai.img2txt(dataUrl);  
                      
                    // Store result  
                    processedResults.push({  
                        filename: file.name,  
                        text: text,  
                        timestamp: new Date().toISOString()  
                    });

                    // Display result  
                    results.innerHTML \+= \`  
                        \<div style="margin-bottom: 20px;"\>  
                            \<strong\>${file.name}\</strong\>  
                            \<pre\>${text || 'No text found'}\</pre\>  
                        \</div\>  
                    \`;  
                } catch (error) {  
                    results.innerHTML \+= \`  
                        \<div style="margin-bottom: 20px; color: red;"\>  
                            \<strong\>${file.name}\</strong\>: Error \- ${error.message}  
                        \</div\>  
                    \`;  
                }  
            }

            progress.textContent \= 'All images processed\!';  
            document.getElementById('save-button').style.display \= 'block';  
        }

        async function saveResults() {  
            try {  
                const resultsText \= processedResults.map(result \=\>   
                    \`File: ${result.filename}\\nTimestamp: ${result.timestamp}\\n\\n${result.text}\\n\\n---\\n\\n\`  
                ).join('');

                await puter.fs.write('ocr-results.txt', resultsText);  
                alert('Results saved to ocr-results.txt');  
            } catch (error) {  
                alert('Error saving results: ' \+ error.message);  
            }  
        }  
    \</script\>  
\</body\>  
\</html\>

This advanced example demonstrates batch processing of multiple images. It includes several useful features:

* Multiple file selection and processing  
* Progress tracking  
* Organized display of results  
* Saving results to a file in your Puter cloud storage  
* Error handling for individual files

## Implementation Tips

1. Always validate input images before processing  
2. Show progress indicators for longer operations  
3. Handle errors gracefully and provide user feedback  
4. Consider image size limits and processing time  
5. Save or export results for later use  
6. Preview images when possible to ensure correct file selection

—------------------------------------------------------

## [Tutorials](https://developer.puter.com/tutorials/)

# **Serverless AI: Forever Free for Developers**

This tutorial will show you how to add powerful AI capabilities to your web applications using Puter.js, completely free and without any API keys or usage restrictions. Using Puter.js, you can leverage multiple AI models including GPT-4o, Claude 3.5 Sonnet, and Llama for various tasks like text generation, analysis, and more.

## Getting Started

Puter.js works without any API keys or sign-ups. To start using Puter.js, include the following script tag in your HTML file, either in the \<head\> or \<body\> section:

\<script src="https://js.puter.com/v2/"\>\</script\>

You're now ready to use Puter.js for free AI capabilities. No API keys or sign-ups are required.

## **Example 1**

## Basic Text Generation with GPT-4o

Here's a simple example showing how to generate text using GPT-4o:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        puter.ai.chat("Explain quantum computing in simple terms").then(response \=\> {  
            document.write(response);  
        });  
    \</script\>  
\</body\>  
\</html\>

This example demonstrates the most basic usage of the AI capabilities. The puter.ai.chat() function sends your prompt to the GPT-4o model and returns the response. By default, Puter.js uses GPT-4o mini, which is optimized for speed and efficiency.

## **Example 2**

## Using Claude 3.5 Sonnet for Complex Tasks

Claude 3.5 Sonnet is particularly good at complex reasoning and detailed analysis:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        puter.ai.chat("Analyze the potential impact of quantum computing on cryptography", {  
            model: 'claude-3-5-sonnet'  
        }).then(response \=\> {  
            document.write(response);  
        });  
    \</script\>  
\</body\>  
\</html\>

This example shows how to specify a different model using the options parameter. Claude 3.5 Sonnet is well-suited for tasks requiring deep analysis or technical understanding.

## **Example 3**

## Streaming Responses with Llama

For longer responses, you can use streaming to get results in real-time:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<script\>  
        async function streamResponse() {  
            const response \= await puter.ai.chat(  
                "Write a detailed analysis of renewable energy sources",   
                {  
                    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',  
                    stream: true  
                }  
            );  
              
            for await (const part of response) {  
                document.write(part?.text);  
            }  
        }

        streamResponse();  
    \</script\>  
\</body\>  
\</html\>

This example demonstrates streaming with Llama, which is particularly useful for longer responses. The streaming approach provides a better user experience by showing the response as it's generated rather than waiting for the complete response.

## **Example 4**

## Vision Capabilities

You can also analyze images using GPT-4 Vision:

\<html\>  
\<body\>  
    \<script src="https://js.puter.com/v2/"\>\</script\>  
    \<img src="https://assets.puter.site/doge.jpeg" id="image"\>  
    \<script\>  
        puter.ai.chat(  
            "What do you see in this image?",  
            "https://assets.puter.site/doge.jpeg"  
        ).then(response \=\> {  
            document.write(response);  
        });  
    \</script\>  
\</body\>  
\</html\>

This example shows how to use GPT-4 Vision capabilities to analyze images. You can pass an image URL as the second parameter to have the AI analyze its contents.

## Best Practices

When implementing AI in your web applications with Puter.js:

1. Choose the appropriate model for your use case:  
   * GPT-4o mini: Best for quick, general-purpose responses  
   * Claude 3.5 Sonnet: Ideal for complex analysis and technical tasks  
   * Llama: Good for general tasks with different model sizes available  
   * GPT-4o: Best for vision-related tasks  
2. Use streaming for longer responses to improve user experience  
3. Handle errors gracefully and provide feedback to users when the AI is processing  
4. Consider rate limiting your requests to ensure fair usage

