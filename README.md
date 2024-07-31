# 项目简介
刚学了一点网站的知识，就试着做了一个可以在线两人对局吃豆人的小游戏。服务器用的是本机电脑。包含前端和后端代码。前端使用js+css+html，代码主要在public文件夹中；后端使用go中的gin框架。
# 快速入手
如果您只是想体验一下本项目。那么您只需要下载一个cpolar软件。主要步骤如下：
1. 将项目下载在本地。git地址为：https://github.com/math-zhuxy/netgame.git
2. 运行项目文件夹中的main.exe。如果出现windows安全中心的弹窗显示，点击确认即可，这是正常现象。
3. 运行后您就可以在本机看到您的网站了。在浏览器中输入网址：http://localhost:8080/ 。即可看到。
4. 但此时别人无法看到您的网站，您需要下载cpolar软件来将您的本机ip暴露在公网中。这个软件的下载配置比较简单，且网上教程很多，这里不再说明。当然，您也可以用其他的内网穿透软件。
5. 下载好后，打开终端，输入指令：cpolar http 8080 。（确保此时main.exe在运行）
6. 此时命令行终端会出现两个网址，选择https的那个，因为比较安全。ctrl+左键点击网址即可访问，您也可以将这个网址发给其他人。
7. 有几点需要注意：
   - 在测试时发现一些版本较老的浏览器不支持本项目前端所用的fetch API。这是需要对浏览器更新，或者在微信的网站界面打开。
   - cpolar免费版产生的域名会变化，因此您关掉cpolar之后先前的网址就无法使用了。
   - 因为使用您的电脑作为后端，因此网站加载速度比较慢，且和网络、您的电脑配置有很大关系。
   - 匹配的代码做的不是很好，如果在match界面退出的话系统依然会认为您处于匹配状态，此时需要重启后端。
当然，您也可以将后端部署在服务器上，并购买专门的域名。如果您想要在本项目代码的基础上加上自己的东西。只需要下载go的编译环境，vscode，以及相关插件即可。最后在项目目录终端输入go mod tidy，下载所需的gin框架。
# 项目结构
文件结构如下：<br>
public <br>
  |---css <br>
  |---iocs <br>
  |---javascript <br>
  |---picture <br>
  |---exit.html <br>
  |---game.html <br>
  |---login.html <br>
  |---main.html <br>
go.sum <br>
go.mod <br>
main.go <br>
main.exe <br>
1. main.go是后端代码
2. 每一个html文件对于一个页面
3. css,javascript文件夹存放html对应的css,js文件
4. picture存放网站的背景图片和游戏图片
5. iocs里面是网站的图标
