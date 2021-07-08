---
title: "Documentation"
---

## Introduction
{class = "text-3xl"}

With the rise of JAMStack, more and more websites have converted to static, and why not? Static websites do have quite a few benefits than dynamic websites or websites backed by a CMS. With the benefits, it also carries some problems. Probably the number one problem is the absence of dynamic features like search, comments, etc. ThreadTalk.JS aims to solve one of them. It is a comment engine written in JavaScript (and styled by CSS). It provides a drop-in solution for any Netlify website to add self-hosted comments to their website easily.
{class = "mt-5"}

{{< warning >}}
The use of the term 'self-hosted' might need some clarification. In this context, self-hosted doesn't necessarily mean 'on your servers'. Instead, it means that you can host the data on other services, and can monitor, edit and control it. You own the data in the sense that the data is in your account, but the actual owner of the data would be the service. This is because they can choose to close their service or change their pricing at any given time and you might be locked out of your data. They can take action against you in case of reported spam or other reasons. You've been warned.
{{< /warning >}}

## Motive
{class = "text-3xl"}

Yes, there are many comment engines out there. Probably the top-ranked Disqus will come to your mind, followed by Facebook Comments, IntenseDebate, Gitalk, utterances and many others. They are great indeed but do have their share of problems. The primary problem is probably that, they are not themeable. Imagine taking time to make the perfect blog or portfolio and then deciding to add comments for user engagement. You try these solutions and find out, they lack one primary thing, the ability to theme them to your liking, your website's design. The former ones are third-party SAAS solutions that completely lock you down to their branding, look and feel. They're also plagued with ads, self-branding and all in all, slow down your website. The latter ones are open-source but it's still difficult to change their design. Furthermore, they rely on GitHub issues, but how many of your users have a GitHub account or are willing to create an account, just to comment on your website? Probably not many. Thus, a free, lightweight, open-source and anonymous solution was required. This is where ThreadTalk.JS comes in.
{class = "mt-5"}

The question remains as to why Netlify Functions? This could have been easily possible using just client-side JavaScript since the libraries that are used in this are available for client-side processing too. The reason is security. By making the entire thing available client-side, it would be easy for anyone to be able to see your API keys. This makes exploiting the keys very easy. Now, with Netlify Functions, we can keep the keys private and combining the power of Netlify Identity, it's possible up to some extent to prevent people from exploiting your functions externally. [Read more in Security](/documentation/security/).
{class = "mt-5"}

## Working
{class = "text-3xl"}

ThreadTalk.JS makes use of modern web technology to achieve its goal. It combines the power of a headless database, [FaunaDB](https://www.fauna.com/) and serverless functions using [Netlify Functions](https://www.netlify.com/products/functions/). This helps to decouple the frontend from all the heavy work which in turn helps to keep the code and bundle size to a minimum. In the serverless functions, ThreadTalk.JS uses a lot of under-the-hood libraries to achieve many more objectives. [Check out all the open-source libraries used by ThreadTalk.JS](/documentation/open-source/).
{class = "mt-5"}

## Prerequisites
{class = "text-3xl"}

1. An account on:
{class = "mt-5 ml-5 p-0 list-decimal"}

* Netlify
* FaunaDB
* Sendinblue
{class = "mt-2.5 ml-10 p-0 space-y-1 list-disc"}

2. Node.js + npm
1. A SCSS compiler
1. A JavaScript bundler
{class = "mt-2.5 ml-5 p-0 list-decimal"}

## Browser support
{class = "text-3xl"}

<div class = "max-w-xs flex justify-between mt-5">
  <div class = "w-1/3 flex flex-col items-center">
    <div>
      <svg xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 24 24" class = "h-10">
        <defs>
          <circle id = "ch-A" cx = "12" cy = "12" r = "8"/>
        </defs>
        <clipPath id = "ch-B">
          <use xlink:href = "#ch-A"/>
        </clipPath>
        <g clip-path = "url(#ch-B)">
          <path d = "M5.3,4v9.8h3.6L12,8.4h8V4H5.3z" fill="#db4437"/>
          <linearGradient id = "ch-C" gradientUnits = "userSpaceOnUse" x1 = "5.895" y1 = "10.111" x2 = "10.668" y2 = "7.329">
            <stop offset = "0" stop-color = "#a52714" stop-opacity = ".6"/>
            <stop offset = ".7" stop-color = "#a52714" stop-opacity = "0"/>
          </linearGradient>
          <path d = "M5.3,4v9.8h3.6L12,8.4h8V4H5.3z" fill = "url(#ch-C)"/>
          <path d = "M4,20h7.6l3.5-3.5v-2.6H8.8L4,5.5V20z" fill = "#0f9d58"/>
          <linearGradient id = "ch-D" gradientUnits = "userSpaceOnUse" x1 = "13.394" y1 = "18.251" x2 = "8.085" y2 = "15.142">
            <stop offset = "0" stop-color = "#055524" stop-opacity = ".4"/>
            <stop offset = ".3" stop-color = "#055524" stop-opacity = "0"/>
          </linearGradient>
          <path d = "M4,20h7.6l3.5-3.5v-2.6H8.8L4,5.5V20z" fill = "url(#ch-D)"/>
          <path d = "M12,8.4l3.1,5.5L11.6,20H20V8.4H12z" fill = "#ffcd40"/>
          <linearGradient id = "ch-E" gradientUnits = "userSpaceOnUse" x1 = "14.383" y1 = "7.905" x2 = "15.72" y2 = "13.751">
            <stop offset = "0" stop-color = "#ea6100" stop-opacity = ".3"/>
            <stop offset = ".7" stop-color = "#ea6100" stop-opacity = "0"/>
          </linearGradient>
          <path d = "M12,8.4l3.1,5.5L11.6,20H20V8.4H12z" fill = "url(#ch-E)"/>
          <path d = "M8.9 13.8L5.3 7.7l3.5 6.2.1-.1z" fill = "#3e2723" fill-opacity = ".1"/>
          <path d = "M15.1 13.9h0L11.6 20l3.5-6.1h0z" fill = "#263238" fill-opacity = ".1"/>
          <radialGradient id = "ch-F" cx = "11.655" cy = "17.636" r = "7.646" gradientTransform = "matrix(1 0 0 -1 0 26)" gradientUnits = "userSpaceOnUse">
            <stop offset = "0" stop-color = "#3e2723" stop-opacity = ".2"/>
            <stop offset = "1" stop-color = "#3e2723" stop-opacity = "0"/>
          </radialGradient>
          <path d = "M12,8.4v1.9l7.1-1.9H12z" fill = "url(#ch-F)"/>
          <radialGradient id = "ch-G" cx = "5.264" cy = "18.318" r = "7.091" gradientTransform = "matrix(1 0 0 -1 0 26)" gradientUnits = "userSpaceOnUse">
            <stop offset = "0" stop-color = "#3e2723" stop-opacity = ".2"/>
            <stop offset = "1" stop-color = "#3e2723" stop-opacity = "0"/>
          </radialGradient>
          <path d = "M5.3 7.7l5.2 5.2-1.6.9-3.6-6.1z" fill = "url(#ch-G)"/>
          <radialGradient id = "ch-H" cx = "11.982" cy = "13.991" r = "7.991" gradientTransform = "matrix(1 0 0 -1 0 26)" gradientUnits = "userSpaceOnUse">
            <stop offset = "0" stop-color = "#263238" stop-opacity = ".2"/>
            <stop offset = "1" stop-color = "#263238" stop-opacity = "0"/>
          </radialGradient>
          <path d = "M11.6 20l1.9-7.1 1.6.9-3.5 6.2z" fill = "url(#ch-H)"/>
          <circle cx = "12" cy = "12" r = "3.6" fill = "#f1f1f1"/><circle cx = "12" cy = "12" r = "2.9" fill = "#4285f4"/>
          <radialGradient id = "ch-I" cx = "6.391" cy = "19.818" r = "16.073" gradientTransform = "matrix(1 0 0 -1 0 26)" gradientUnits = "userSpaceOnUse">
            <stop offset = "0" stop-color = "#fff" stop-opacity = ".1"/>
            <stop offset = "1" stop-color = "#fff" stop-opacity = "0"/>
          </radialGradient>
          <circle cx = "12" cy = "12" r = "8" fill = "url(#ch-I)"/>
          <radialGradient  cx = "12" cy = "-74.909" r = "0" gradientTransform = "matrix(1 0 0 -1 0 26)" gradientUnits = "userSpaceOnUse">
            <stop offset = "0" stop-color = "#fff" stop-opacity = ".1"/>
            <stop offset = "1" stop-color = "#fff" stop-opacity = "0"/>
          </radialGradient>
          <radialGradient  cx = "12" cy = "-74.909" r = "0" gradientTransform = "matrix(1 0 0 -1 0 26)" gradientUnits = "userSpaceOnUse">
            <stop offset = "0" stop-color = "#fff" stop-opacity = ".1"/>
            <stop offset = "1" stop-color = "#fff" stop-opacity = "0"/>
          </radialGradient>
          <radialGradient  cx = "12" cy = "-74.909" r = "0" gradientTransform = "matrix(1 0 0 -1 0 26)" gradientUnits = "userSpaceOnUse">
            <stop offset = "0" stop-color = "#fff" stop-opacity = ".1"/>
            <stop offset = "1" stop-color = "#fff" stop-opacity = "0"/>
          </radialGradient>
          <path d = "M12 8.3c-2 0-3.6 1.6-3.6 3.6v.1c0-2 1.6-3.6 3.6-3.7l8 .1v-.1h-8z" fill = "#3e2723" fill-opacity = ".2"/>
        </g>
      </svg>
    </div>
    <div>
      <p class = "text-center text-sm">
        Chrome 42+
      </p>
    </div>
  </div>
  <div class = "w-1/3 flex flex-col items-center">
    <div>
      <svg xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 24 24" class = "h-10">
        <g>
          <use xlink:href = "#fi-M"/>
          <use xlink:href = "#fi-N"/>
          <path d = "M19.423 9.278c-.348-.837-1.054-1.741-1.607-2.027.451.884.711 1.77.811 2.431l.002.014c-.906-2.258-2.442-3.168-3.696-5.151l-.189-.306-.088-.166a1.5 1.5 0 0 1-.12-.317c.001-.01-.007-.02-.018-.021l-.019.002-.006.003.004-.004c-2.013 1.178-2.695 3.358-2.758 4.45a4.01 4.01 0 0 0-2.205.849c-.066-.056-.135-.108-.207-.157-.183-.639-.191-1.315-.023-1.957-.823.374-1.463.966-1.928 1.489h-.003c-.318-.401-.296-1.728-.278-2.005-.003-.018-.236.121-.267.141a5.89 5.89 0 0 0-.783.671c-.274.278-.524.578-.748.897v.001-.001c-.515.73-.881 1.555-1.075 2.427l-.011.053-.079.5-.002.017A7.76 7.76 0 0 0 4 12.217v.04a8.01 8.01 0 0 0 8.01 8.009c3.963 0 7.252-2.876 7.897-6.654l.036-.309c.159-1.373-.017-2.817-.52-4.025h0zm-9.233 6.27c.037.018.073.038.111.055l.005.003-.116-.058zm8.439-5.851l-.001-.007.001.008v-.001z" fill = "url(#fi-A)"/>
          <use xlink:href = "#fi-M" fill = "url(#fi-B)"/>
          <use xlink:href = "#fi-M" fill = "url(#fi-C)"/>
          <path d = "M15.53 10.22l.05.037a4.36 4.36 0 0 0-.743-.971c-2.491-2.489-.654-5.398-.344-5.546l.003-.004c-2.012 1.178-2.695 3.359-2.757 4.449l.281-.014a4.04 4.04 0 0 1 3.51 2.05v-.001z" fill = "url(#fi-D)"/>
          <use xlink:href = "#fi-N" fill = "url(#fi-E)"/>
          <use xlink:href = "#fi-N" fill = "url(#fi-F)"/>
          <path d = "M9.161 8.768l.166.11c-.183-.639-.19-1.315-.023-1.958-.823.375-1.463.967-1.928 1.49.039-.001 1.2-.022 1.785.358z" fill = "url(#fi-G)"/>
          <path d = "M4.074 12.447c.618 3.653 3.929 6.441 7.687 6.547 3.479.099 5.701-1.92 6.619-3.889.594-1.274 1.006-3.357.25-5.406v-.001l-.002-.008.001.006c.284 1.855-.66 3.653-2.135 4.868l-.004.01c-2.875 2.341-5.626 1.412-6.184 1.032l-.116-.058c-1.676-.801-2.368-2.328-2.22-3.637-1.415 0-1.898-1.194-1.898-1.194s1.271-.906 2.945-.118c1.551.73 3.008.118 3.008.118-.003-.065-1.397-.62-1.941-1.155-.29-.287-.428-.424-.55-.528a2.45 2.45 0 0 0-.208-.156 6.82 6.82 0 0 0-.166-.11c-.584-.38-1.746-.359-1.784-.358h-.004c-.317-.402-.295-1.729-.277-2.006-.003-.017-.237.121-.267.142a5.76 5.76 0 0 0-.783.67c-.274.278-.524.578-.748.898l-.001.001v-.001a6.76 6.76 0 0 0-1.075 2.426c-.003.017-.288 1.261-.148 1.907h.001z" fill = "url(#fi-H)"/>
          <path d = "M14.836 9.287a4.36 4.36 0 0 1 .744.97l.12.098c1.816 1.674.865 4.04.793 4.209 1.475-1.215 2.419-3.013 2.135-4.868-.905-2.258-2.441-3.168-3.695-5.151l-.189-.306-.088-.166a1.5 1.5 0 0 1-.12-.317c.001-.01-.007-.02-.018-.021l-.019.002-.006.003c-.31.148-2.146 3.057.344 5.547h-.001z" fill = "url(#fi-I)"/>
          <path d = "M15.7 10.355c-.038-.035-.078-.067-.12-.098l-.05-.037c-.427-.3-1.193-.597-1.931-.469 2.881 1.441 2.108 6.401-1.885 6.213a3.53 3.53 0 0 1-1.042-.201l-.236-.096-.135-.064.006.003c.556.38 3.308 1.308 6.183-1.032l.004-.01c.071-.169 1.023-2.536-.793-4.209H15.7z" fill = "url(#fi-J)"/>
          <path d = "M8.414 12.981s.37-1.377 2.648-1.377c.247 0 .95-.688.963-.887s-1.456.612-3.007-.118c-1.675-.788-2.945.118-2.945.118s.482 1.193 1.897 1.193c-.148 1.31.544 2.837 2.22 3.638l.111.055c-.978-.506-1.786-1.462-1.886-2.622h-.001z" fill = "url(#fi-K)"/>
          <path d = "M19.423 9.278c-.348-.837-1.054-1.741-1.607-2.027.451.884.711 1.77.811 2.431l.002.014c-.906-2.258-2.442-3.168-3.696-5.151l-.189-.306-.088-.166a1.5 1.5 0 0 1-.12-.317c.001-.01-.007-.02-.018-.021l-.019.002-.006.003.004-.004c-2.013 1.178-2.695 3.358-2.758 4.45l.281-.015c1.502 0 2.81.826 3.51 2.049-.428-.3-1.193-.597-1.931-.469 2.881 1.441 2.107 6.401-1.885 6.214-.356-.015-.707-.083-1.043-.201l-.235-.097-.135-.064.006.003-.117-.058.111.055c-.978-.506-1.786-1.461-1.887-2.622 0 0 .37-1.377 2.648-1.377.246 0 .95-.688.963-.887-.003-.065-1.397-.62-1.941-1.155l-.55-.528-.207-.156c-.183-.639-.19-1.315-.023-1.958-.823.375-1.463.967-1.928 1.49h-.003c-.318-.402-.295-1.729-.277-2.006-.004-.017-.237.121-.268.142a5.88 5.88 0 0 0-.783.67c-.273.278-.524.578-.747.898l-.001.001v-.001a6.76 6.76 0 0 0-1.075 2.426l-.01.053-.093.505c-.062.37-.101.743-.118 1.118L4 12.257a8.01 8.01 0 0 0 8.01 8.009c3.963 0 7.252-2.876 7.897-6.654l.036-.309c.159-1.373-.017-2.817-.52-4.025h0zm-.795.412l.001.008h0l-.001-.008z" fill = "url(#fi-L)"/>
        </g>
        <defs>
          <linearGradient id = "fi-A" x1 = "17.96" y1 = "6.296" x2 = "5.504" y2 = "19.126" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#fff44f"/>
            <stop offset = ".05" stop-color = "#fff44f"/>
            <stop offset = ".37" stop-color = "#ff980e"/>
            <stop offset = ".53" stop-color = "#ff3647"/>
            <stop offset = ".7" stop-color = "#e31587"/>
          </linearGradient>
          <radialGradient id = "fi-B" cx = "0" cy = "0" r = "1" gradientTransform = "matrix(16.384,0,0,20.48,18.0672,7.26422)" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#ffbd4f"/>
            <stop offset = ".13" stop-color = "#ffbd4f"/>
            <stop offset = ".28" stop-color = "#ff980e"/>
            <stop offset = ".47" stop-color = "#ff3750"/>
            <stop offset = ".78" stop-color = "#eb0878"/>
            <stop offset = ".86" stop-color = "#e50080"/>
          </radialGradient>
          <radialGradient id = "fi-C" cx = "0" cy = "0" r = "1" gradientTransform = "matrix(16.7936,0,0,20.48,11.8688,12.4573)" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#960e18"/>
            <stop offset = ".3" stop-color = "#960e18"/>
            <stop offset = ".35" stop-color = "#b11927" stop-opacity = ".74"/>
            <stop offset = ".43" stop-color = "#db293d" stop-opacity = ".34"/>
            <stop offset = ".5" stop-color = "#f5334b" stop-opacity = ".1"/>
            <stop offset = ".53" stop-color = "#ff3750" stop-opacity = "0"/>
          </radialGradient>
          <radialGradient id = "fi-D" cx = "0" cy = "0" r = "1" gradientTransform = "matrix(9.12905,0,0,9.12905,13.5826,2.95352)" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#fff44f"/>
            <stop offset = ".13" stop-color = "#fff44f"/>
            <stop offset = ".53" stop-color = "#ff980e"/>
          </radialGradient>
          <radialGradient id = "fi-E" cx = "0" cy = "0" r = "1" gradientTransform = "matrix(7.7992,0,0,7.7992,10.034,16.7579)" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#3a8ee6"/>
            <stop offset = ".35" stop-color = "#3a8ee6"/>
            <stop offset = ".67" stop-color = "#9059ff"/>
            <stop offset = "1" stop-color = "#c139e6"/>
          </radialGradient>
          <radialGradient id = "fi-F" cx = "0" cy = "0" r = "1" gradientTransform = "matrix(4.14137,0,0,4.60153,11.7445,10.7439)" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#9059ff" stop-opacity = "0"/>
            <stop offset = ".21" stop-color = "#9059ff" stop-opacity = "0"/>
            <stop offset = ".97" stop-color = "#6e008b" stop-opacity = ".6"/>
          </radialGradient>
          <radialGradient id = "fi-G" cx = "0" cy = "0" r = "1" gradientTransform = "matrix(5.67798,0,0,5.67798,11.4724,4.9623)" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#ffe226"/>
            <stop offset = ".1" stop-color = "#ffe226"/>
            <stop offset = ".79" stop-color = "#ff7139"/>
          </radialGradient>
          <radialGradient id = "fi-H" cx = "0" cy = "0" r = "1" gradientTransform = "matrix(27.0096,0,0,27.0096,16.639,1.23794)" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#fff44f"/>
            <stop offset = ".11" stop-color = "#fff44f"/>
            <stop offset = ".46" stop-color = "#ff980e"/>
            <stop offset = ".72" stop-color = "#ff3647"/>
            <stop offset = ".9" stop-color = "#e31587"/>
          </radialGradient>
          <radialGradient id = "fi-I" cx = "0" cy = "0" r = "1" gradientTransform = "matrix(3.94873,37.2911,-17.7893,1.85594,14.3289,1.63383)" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#fff44f"/>
            <stop offset = ".3" stop-color = "#ff980e"/>
            <stop offset = ".57" stop-color = "#ff3647"/>
            <stop offset = ".74" stop-color = "#e31587"/>
          </radialGradient>
          <radialGradient id = "fi-J" cx = "0" cy = "0" r = "1" gradientTransform = "matrix(15.5077,0,0,15.5077,11.5309,7.00476)" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#fff44f"/>
            <stop offset = ".14" stop-color = "#fff44f"/>
            <stop offset = ".48" stop-color = "#ff980e"/>
            <stop offset = ".66" stop-color = "#ff3647"/>
            <stop offset = ".9" stop-color = "#e31587"/>
          </radialGradient>
          <radialGradient id = "fi-K" cx = "0" cy = "0" r = "1" gradientTransform = "matrix(18.6384,0,0,18.6384,15.5555,7.89569)" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#fff44f"/>
            <stop offset = ".09" stop-color = "#fff44f"/>
            <stop offset = ".63" stop-color = "#ff980e"/>
          </radialGradient>
          <linearGradient id = "fi-L" x1 = "16.8" y1 = "6.048" x2 = "6.88" y2 = "17.621" xlink:href = "#fi-O">
            <stop offset = "0" stop-color = "#fff44f" stop-opacity = ".8"/>
            <stop offset = ".17" stop-color = "#fff44f" stop-opacity = ".8"/>
            <stop offset = ".6" stop-color = "#fff44f" stop-opacity = "0"/>
          </linearGradient>
          <path id = "fi-M" d = "M19.423 9.278c-.348-.837-1.054-1.741-1.607-2.027.451.884.711 1.77.811 2.431l.003.016c.756 2.049.344 4.133-.25 5.406-.918 1.97-3.139 3.989-6.618 3.89-3.759-.106-7.07-2.894-7.688-6.547-.113-.576 0-.869.057-1.336-.069.36-.096.464-.13 1.105L4 12.257a8.01 8.01 0 0 0 8.01 8.009c3.963 0 7.252-2.876 7.897-6.654l.036-.309c.159-1.373-.017-2.817-.52-4.025h0z"/>
          <path id = "fi-N" d = "M12.025 10.717c-.013.199-.716.886-.963.886-2.278 0-2.648 1.378-2.648 1.378.101 1.16.909 2.116 1.887 2.622l.135.064.235.096a3.54 3.54 0 0 0 1.043.201c3.992.188 4.766-4.773 1.885-6.213.737-.128 1.503.168 1.931.469-.7-1.224-2.008-2.05-3.51-2.05-.095 0-.188.008-.281.015a4.01 4.01 0 0 0-2.205.849c.122.103.26.241.55.528.543.535 1.938 1.09 1.941 1.155h0z"/>
          <linearGradient id = "fi-O" gradientUnits = "userSpaceOnUse"/>
        </defs>
      </svg>
    </div>
    <div>
      <p class = "text-center text-sm">
        Firefox 39+
      </p>
    </div>
  </div>
  <div class = "w-1/3 flex flex-col items-center">
    <div>
      <svg xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 24 24" class = "h-10">
        <path d = "M20 7.29c0-1.807-1.467-3.274-3.275-3.274h-9.45C5.467 4.016 4 5.483 4 7.29v9.42c0 1.807 1.467 3.274 3.275 3.274h9.45c1.808 0 3.275-1.467 3.275-3.274V7.29z" fill = "#fff"/>
        <circle cx = "11.984" cy = "12" r = "6.986" fill = "url(#sa-A)"/>
        <g>
          <path d = "M16.756 7.197l-5.364 4.21 1.247 1.248 4.117-5.458z" fill = "red"/>
          <path d = "M7.181 16.772l4.211-5.365 1.247 1.248-5.458 4.117z" fill = "#fff"/>
          <path d = "M11.984 5.7v1.029m0 10.511v1.029m1.092-12.476l-.178 1.014m-1.827 10.349l-.178 1.019M14.136 6.08l-.352.967m-3.596 9.875l-.353.966m1.058-12.095l.178 1.014m1.827 10.349l.178 1.019M9.832 6.08l.353.967m3.593 9.875l.352.966M8.841 6.542l.517.892m5.256 9.101l.514.892M7.945 7.166l.662.789m6.755 8.053l.661.789M7.166 7.939l.789.661m8.053 6.762l.789.661M6.536 8.844l.892.514m9.107 5.256l.892.514M6.074 9.835l.967.353m9.874 3.587l.967.352M5.79 10.883l1.017.181m10.355 1.834l1.013.178M5.7 11.984h1.029m10.511 0h1.029M5.793 13.076l1.014-.178m10.355-1.827l1.013-.178M6.083 14.136l.967-.352m9.872-3.593l.966-.352M6.542 15.128l.892-.514m9.107-5.256l.892-.514M7.169 16.023l.789-.661m8.047-6.755l.789-.662m-8.858 8.858l.661-.789m6.756-8.053l.661-.789M8.841 17.427l.517-.892m5.256-9.101l.514-.892m-3.693-.817l.05.561m.998 11.403l.05.561M10.356 5.918l.147.543m2.963 11.053l.146.543M9.327 6.292l.237.509m4.834 10.373l.241.509M8.379 6.835l.321.462m6.569 9.375l.321.462M7.54 7.54l.396.396m8.097 8.097l.396.396M6.838 8.382l.462.321m9.375 6.572l.456.312M6.289 9.327l.509.237m10.373 4.834l.509.241M5.915 10.356l.543.147m11.053 2.963l.543.146M5.725 11.439l.561.049m11.403.999l.561.049m-12.519 0l.561-.049m11.403-.999l.562-.049M5.915 13.612l.543-.146m11.053-2.963l.543-.147M6.289 14.642l.509-.237M17.171 9.57l.509-.237M6.838 15.587l.462-.322m9.375-6.571l.456-.312m-8.752 8.752l.321-.462m6.565-9.375l.325-.462M9.327 17.676l.24-.508m4.835-10.377l.24-.508m-4.286 11.768l.147-.543m2.963-11.053l.146-.543m-2.177 12.326l.05-.562m.998-11.402l.05-.562" stroke = "#fff" stroke-width = ".09"/>
        </g>
        <defs>
          <linearGradient id = "sa-A" x1 = "4" y1 = "4.016" x2 = "4.998" y2 = "18.986" gradientUnits = "userSpaceOnUse">
            <stop offset = "0" stop-color = "#19d7ff"/>
            <stop offset = "1" stop-color = "#1e64f0"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div>
      <p class = "text-center text-sm">
        Safari 10+
      </p>
    </div>
  </div>
</div>

Internet Explorer is not supported because it does not support Fetch API which is highly required by ThreadTalk.JS.
{class = "mt-5"}