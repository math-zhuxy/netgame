package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"fmt"

	"math/rand"

	"time"
)

type DATA struct {
	Herox     int `json:"herox"`
	Heroy     int `json:"heroy"`
	HeroDir   int `json:"herodir"`
	UserPos   int `json:"user"`
	HeroScore int `json:"score"`
	EatenBx   int `json:"beansx"`
	EatenBy   int `json:"beansy"`
	Ghostx    int `json:"ghostx"`
	Ghosty    int `json:"ghosty"`
	//IsExited  bool `json:"state"`
	//CreateBean bool `json:"createbean"`
}

type MATCH struct {
	Userid int `json:"userid"`
}

type INIT struct {
	//IsInited int `json:"user"`
	X       int `json:"x"`
	Y       int `json:"y"`
	MaxWall int `json:"max"`
	MaxBean int `json:"maxbean"`
	MaxTrap int `json:"maxtrap"`
}

type JUMP struct {
	State string `json:"state"`
}

func AssignmentOperation(a *DATA, b *DATA) {
	a.Herox = b.Herox
	a.Heroy = b.Heroy
	a.HeroDir = b.HeroDir
	a.HeroScore = b.HeroScore
	a.EatenBx = b.EatenBx
	a.EatenBy = b.EatenBy
	a.Ghostx = b.Ghostx
	a.Ghosty = b.Ghosty
}

type GAMEROOM struct {
	user_1        DATA
	user_2        DATA
	GameIsExited  bool
	GameIsInited  bool
	GameIsMatched bool
	//GameIsFull     bool
	UserIdForGamer int
	wallArrayx     [50]int
	wallArrayy     [50]int
	beanArrayx     [50]int
	beanArrayy     [50]int
	trapArrayx     [50]int
	trapArrayy     [50]int
	boxArrayx      [10]int
	boxArrayy      [10]int
	max_box_size   int
}

func InitAllUserAfterGame(a *DATA) {
	a.Herox = 0
	a.Heroy = 0
	a.Herox = 0
	a.HeroDir = 0
	a.HeroScore = 0
	a.EatenBx = 0
	a.EatenBy = 0
	a.Ghostx = 0
	a.Ghosty = 0
}

func InitGameRoom(a *GAMEROOM) {
	a.max_box_size = 5
	a.GameIsExited = false
	a.GameIsInited = false
	a.GameIsMatched = false
	a.UserIdForGamer = 0
	//a.GameIsFull = false
	InitAllUserAfterGame(&a.user_1)
	InitAllUserAfterGame(&a.user_2)
}
func main() {
	var GameRoom GAMEROOM
	GameRoom.max_box_size = 5
	/*
		var UserIdForGamer = 0

		var GameIsMatched = false

		var IsExitedGame bool = false

		var user_1 DATA

		var user_2 DATA

		var GameIsInited bool = false*/

	router := gin.Default()

	router.Use(corsMiddleware())

	router.LoadHTMLGlob("public/*.html")

	router.Static("/css", "public/css")
	router.Static("/javascript", "public/javascript")
	router.Static("/picture", "public/picture")
	router.Static("/iocs", "public/iocs")

	router.GET("/", func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "main.html", gin.H{})
	})

	router.GET("/loginpage", func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "login.html", gin.H{})
	})

	router.GET("/gamepage", func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "game.html", gin.H{})
	})

	router.GET("/exitpage", func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "exit.html", gin.H{})
	})

	router.POST("/match", func(ctx *gin.Context) {
		//IsExitedGame = false

		//InitAllUserAfterGame(&user_1)
		//InitAllUserAfterGame(&user_2)
		//GameIsInited = false

		//重新开始匹配时，GameIsExited属性设为false，重新开始计算
		GameRoom.GameIsExited = false
		//为什么不在这里初始化GameRoom：因为这里已经开始游戏了，UerIdForGamer已经开始赋值了

		var getdata MATCH
		if err := ctx.ShouldBindJSON(&getdata); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		fmt.Println(getdata.Userid)
		//一开始userid都为0，则为0表示未分配id，进入房间的用户数++
		if getdata.Userid == 0 {
			GameRoom.UserIdForGamer++
		}
		//用户数已满
		if GameRoom.UserIdForGamer >= 2 {
			GameRoom.GameIsMatched = true
		}
		fmt.Printf("all users is: %d\n", GameRoom.UserIdForGamer)
		ctx.JSON(http.StatusOK, gin.H{
			"userid":    GameRoom.UserIdForGamer,
			"ismatched": GameRoom.GameIsMatched,
		})
	})

	//var InitedUerIdSum int = 0
	//var InitedUser INITUSER
	//InitedUser.user_1 = false
	//InitedUser.user_2 = false
	/*
		wallArrayx := make([]int, 50)
		wallArrayy := make([]int, 50)
		beanArrayx := make([]int, 50)
		beanArrayy := make([]int, 50)
		trapArrayx := make([]int, 50)
		trapArrayy := make([]int, 50)
		boxArrayx := make([]int, 10)
		boxArrayy := make([]int, 10)
		const MAX_BOX_SIZE int = 5*/

	router.POST("/init", func(ctx *gin.Context) {
		var MAX_X_SIZE int
		var MAX_Y_SIZE int
		source := rand.NewSource(time.Now().UnixNano())
		RandomEngine := rand.New(source)
		var initdata INIT
		if err := ctx.ShouldBindJSON(&initdata); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		max := initdata.MaxWall
		maxbean := initdata.MaxBean
		maxtrap := initdata.MaxTrap
		if !GameRoom.GameIsInited {
			MAX_X_SIZE = initdata.X
			MAX_Y_SIZE = initdata.Y
			for i := 0; i < max; i++ {
				GameRoom.wallArrayx[i] = RandomEngine.Intn(MAX_X_SIZE)
				GameRoom.wallArrayy[i] = RandomEngine.Intn(MAX_Y_SIZE)
			}
			for i := 0; i < maxbean; i++ {
				for {
					GameRoom.beanArrayx[i] = RandomEngine.Intn(MAX_X_SIZE)

					minSum := 0
					if GameRoom.beanArrayx[i]%2 == 0 {
						minSum = GameRoom.beanArrayx[i] / 2
					}
					if GameRoom.beanArrayx[i]%2 == 1 {
						minSum = GameRoom.beanArrayx[i]/2 + 1
					}
					maxSum := MAX_X_SIZE + MAX_Y_SIZE
					maxSum = maxSum / 2
					var sum int = 2 * (minSum + RandomEngine.Intn(maxSum-minSum))

					GameRoom.beanArrayy[i] = sum - GameRoom.beanArrayx[i]
					if GameRoom.beanArrayx[i] >= 0 && GameRoom.beanArrayx[i] < MAX_X_SIZE && GameRoom.beanArrayy[i] >= 0 && GameRoom.beanArrayy[i] < MAX_Y_SIZE {
						break
					}
				}
			}
			for i := 0; i < maxtrap; i++ {
				GameRoom.trapArrayx[i] = RandomEngine.Intn(MAX_X_SIZE)
				GameRoom.trapArrayy[i] = RandomEngine.Intn(MAX_Y_SIZE)
			}
			for i := 0; i < GameRoom.max_box_size; i++ {
				GameRoom.boxArrayx[i] = RandomEngine.Intn(MAX_X_SIZE)
				GameRoom.boxArrayy[i] = RandomEngine.Intn(MAX_Y_SIZE)
			}
			GameRoom.GameIsInited = true
		}
		ctx.JSON(http.StatusOK, gin.H{
			"wallx":    GameRoom.wallArrayx,
			"wally":    GameRoom.wallArrayy,
			"size":     max,
			"beanx":    GameRoom.beanArrayx,
			"beany":    GameRoom.beanArrayy,
			"beansize": maxbean,
			"trapx":    GameRoom.trapArrayx,
			"trapy":    GameRoom.trapArrayy,
			"trapsize": maxtrap,
			"boxx":     GameRoom.boxArrayx,
			"boxy":     GameRoom.boxArrayy,
			"boxsize":  GameRoom.max_box_size,
		})
	})

	router.POST("/data", func(ctx *gin.Context) {
		var getdata DATA
		var sendbackdata DATA
		if err := ctx.ShouldBindJSON(&getdata); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if getdata.UserPos == 1 {
			AssignmentOperation(&GameRoom.user_1, &getdata)

			AssignmentOperation(&sendbackdata, &GameRoom.user_2)

		}
		if getdata.UserPos == 2 {
			AssignmentOperation(&GameRoom.user_2, &getdata)

			AssignmentOperation(&sendbackdata, &GameRoom.user_1)

		}

		if GameRoom.user_1.HeroScore < -100 || GameRoom.user_2.HeroScore < -100 {
			//IsExitedGame = true
			//UserIdForGamer = 0
			//GameIsInited = false
			//GameIsMatched = false
			InitGameRoom(&GameRoom)
			/*初始化GameRoom，但GameIsExited不能初始化，
			因为要确保两个玩家都能发送到GameIsExited属性，
			，如果一检测到结束就初始化，那第二个发送POST请求的玩家得到的就是
			初始化后的GameRoom，因此他的GameIsExited为false,
			我打算在下一次match开始时初始化它*/
			GameRoom.GameIsExited = true

		}
		ctx.JSON(http.StatusOK, gin.H{
			"x":    sendbackdata.Herox,
			"y":    sendbackdata.Heroy,
			"dir":  sendbackdata.HeroDir,
			"src":  sendbackdata.HeroScore,
			"eatx": sendbackdata.EatenBx,
			"eaty": sendbackdata.EatenBy,
			"gx":   sendbackdata.Ghostx,
			"gy":   sendbackdata.Ghosty,
			"ex":   GameRoom.GameIsExited,
		})
	})

	router.Run(":8080")
}

// CORS ,和google的安全检测有关
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400") // 24 hours
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
		} else {
			c.Next()
		}
	}
}
