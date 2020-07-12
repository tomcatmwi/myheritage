# MyHeritage photo colorizer automator script
Let's just call it MHPCCAS. It helps you colorize old black and white photos.

# What the hack?!
Yup, that's exactly what it is. So here's the thing:
- MyHeritage.com offers an awesome online service to colorize old black and white photos with a deep learning AI: https://myheritage.com/incolor
- To use this service you have to register and start a two-week trial, which requires a credit card.
- When signing up, they claim it's just $16. Well, it's NOT! If you don't read the confirmation e-mail, you'll miss the message: $16 is for one month, and they'll take an entire year's membership fee, $194.50 plus tax, which is borderline scam. (Don't even ask me how 12*16 = 194.5!) Plus it's a recurring fee. They'll take it again a year later, unless you cancel your membership.
- But you can still sign up and use the service for 2 weeks for free! So how about scamming them back? That's what this script is for. You probably have hundreds of old family photos. Uploading them one by one by hand is tedious and time-consuming. It's unlikely you can finish more than a dozen or so during the short trial. You may also hate the watermark which MyHeritage puts on every picture. MHPCAAS takes the sweat out of the process.

# How?
1. You'll need Node.js and Selenium Webdriver installed.
2. Register yourself on MyHeritage.com with email address and password (not a Google or Facebook account!), then sign up for the two-week trial.
2. Put your black and white photos into the `/picdir` directory in JPG, PNG or GIF format, and run `node 01` from the project root. It will add a 250px wide white border to each of the images and move them into `/temp`. The border is needed because MyHeritage puts a watermark to the bottom of colorized pictures which we won't need.
3. The next script will use Selenium to automate Google Chrome. If you wish to use it with Firefox or some other browser, you'll have to modify it.
4. Configure Chrome to save downloaded files automatically. This is the default setting, but you may have changed it.
5. Edit `02.js` and add your username and password used on MyHeritage.com.
6. Run `node 02`. Selenium will open Chrome, navigate to MyHeritage.com and log in. It'll likely be stopped by re:captcha and you'll have to get through it manually. The script will resume execution when it detects that you're logged in.
7. It will now upload every image file from `/temp` and download the colorized result.
8. There's a bug I didn't bother to fix! (Actually more than one, but hey...) Sometimes the process gets stuck because Selenium can't find the `Download colorized image` button. You'll see the message `Attempting to download...` appearing on the console repeatedly. Don't stop the script, just go to the Chrome window and click on the `Download photo` link which will display the dropdown with the download link. The script will notice it and resume running. It happens after every 10-15 pictures for me, a little bit annoying, but hey, feel free fixing it if it really bothers you.
9. When it runs out of images, the script will elegantly crash with an UnhandledPromiseRejectionWarning exception. Yeah, I like it that way.
10. Now copy all the downloaded files into `/temp`. You can delete the black and white ones.
11. Run `node 03` to remove white frames along with MyHeritage's watermark. Your finished images will appear in `/output`.
12. DON'T FORGET TO UNSUBSCRIBE BEFORE THE TRIAL PERIOD RUNS OUT!! Or you'll be charged $194.50 plus tax.

# Disclaimer
Of course there's no warranty of any kind. Use MHPCAAS at your own risk. It hasn't killed anyone yet, but you never know. Step away from the computer while it's running. Perhaps have some weapon at hand. Clearly this isn't the nicest script I've ever made, and it's outright horrifying at some places. But it works, and I didn't want to spend more time on it. If you feel like fixing something, please do and drop me a pull request.