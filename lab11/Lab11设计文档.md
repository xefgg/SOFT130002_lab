# Lab11设计文档

姓名：俞晓莉

学号：18307130274

------------------------------------------------------------------

## Exercise1: Using Cookie 

在原有的代码基础上修改代码如下：

```php+HTML
<?php
    require_once("config.php");
    $loggedIn=false;
    if(isset($_COOKIE['Username'])){
        echo "Welcome ".$_COOKIE['Username'];
    }else{
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if(validLogin()){
                echo "Welcome ".$_POST['username'];
                // add 1 day to the current time for expiry time
                $loggedIn=true;
                $expiryTime = time()+60*60*24;
                setcookie("Username", $_POST['username'], $expiryTime);
            }
            else{
                echo "login unsuccessful";
            }
        }
        else{
            echo "No Post detected";
        }
    }

?>
```

```php+HTML
    <?php
        if (!isset($_COOKIE['Username']) && !$loggedIn){
            echo getLoginForm();
        }
        else{
            echo "This is some content";
            echo '<p></p>';
            echo '<a href="logout.php"><button>Log out</button></a>';
        }
    ?>
```

​		主要修改的地方一个把判断是否存有cookie提前，且提供了一个if-else分支，如果已经存有cookie，就直接echo欢迎语句，如果没有，说明是新的登陆，就需要用到login form，并在验证正确后，将用户名存入cookie、设置时间。

​		还有就是发现，如果第二段代码只是对cookie内是否存了用户名进行判断的话，那么如果用户是利用表单来进行新登陆，点击按钮之后不会跳出this is some content的内容语句，依旧还是显示了表单，只有再刷新一次才会显示正确的内容语句（个人觉得是由于没有用到ajax进行异步更新的缘故，刷新后才会更新cookie状态，因此表单登录不刷新就还是会显示表单）。因此在第二段代码中新增加了对$loggedIn变量的判断，同时从cookie和表单登录两种方式来考虑用户是否已经变为了登录状态。修改后，逻辑正确。第一次登陆显示no post found和表单；表单登录后显示welcome和内容语句和登出按钮；刷新后由于cookie存在，依旧显示已登录的页面；点击登出按钮链接到logout.php，实现对cookie的注销，页面重新跳转到no post found和表单页面。

​		把用户的相关信息存在cookie里，并设置好保留cookie的时间，就可以让浏览器知道，现在正在操作的是哪一位用户，me一次只需要从$_COOKIE取出想要的对应量就可以获得需要的用户相关信息，就可以再根据这些信息取出用户的相关数据进行操作了。cookie可以在客户端上简单缓存和识别用户身份，但由于每次请求都需要带上cookie信息，而且cookie使用明文传输，因此一旦cookie被人拦截，那拦截方就可以获得用户信息了；且cookie数量和长度都有限制。

------------------------------------------

## Exercise2: Session

以下贴出代码：

```php+HTML
<?php
session_start();
function validLogin()
{
    $pdo = new PDO(DBCONNSTRING, DBUSER, DBPASS);
    //very simple (and insecure) check of valid credentials.
    $sql = "SELECT * FROM Credentials WHERE Username=:user and Password=:pass";

    $statement = $pdo->prepare($sql);
    $statement->bindValue(':user', $_POST['username']);
    $statement->bindValue(':pass', $_POST['pword']);
    $statement->execute();
    if ($statement->rowCount() > 0) {
        return true;
    }
    return false;
}
?>
<html lang="en">
<head>

<!-- Latest compiled and minified Bootstrap Core CSS -->
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">

   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
   <title>Exercise 11-1 | Using Cookies</title>
</head>

<body>
<header>
</header>


<?php
function getLoginForm(){
   return "
<form action='' method='post' role='form'>
<div class ='form-group'>
  <label for='username'>Username</label>
  <input type='text' name='username' class='form-control'/>
</div>
<div class ='form-group'>
  <label for='pword'>Password</label>
  <input type='password' name='pword' class='form-control'/>
</div>
<input type='submit' value='Login' class='form-control' />

</form>";
}
?>
 <div class="container theme-showcase" role="main">  
      <div class="jumbotron">
        <h1>
<?php
    require_once("config.php");
    $loggedIn=false;
    if(isset($_SESSION['Username'])){
        echo "Welcome ".$_SESSION['Username'];
    }else{
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if(validLogin()){
                echo "Welcome ".$_POST['username'];
                // add 1 day to the current time for expiry time
                $loggedIn=true;
                $SESSION['Username'] = $_POST['username'];
            }
            else{
                echo "login unsuccessful";
            }
        }
        else{
            echo "No Post detected";
        }
    }

?>

</h1>
      </div>
<?php
    if (!isset($_SESSION['Username']) && !$loggedIn){
        echo getLoginForm();
    }
    else{
        echo "This is some content";
        echo '<p></p>';
        echo '<a href="logout.php"><button>Log out</button></a>';
    }
?>
 </div>
</body>
</html>
```

​		session整体上和cookie差不多，都可以用来解决维持http协议的状态，不同的是session会将信息存在服务器上而不是浏览器里，当用户访问某一站点时，服务器会针对用户产生唯一的session_id，并以cookie的形式发送到客户端，且以后所有的请求都会自动携带cookie。

​		session由于有比较好的封装性，对于编程人员来说较为方便，使用方式比较清晰明了。但由于session_id就相当于用户的象征，所以一旦session_id被获取，就可以伪造用户身份。而且由于封装性，也没有办法自主设置cookie的过期时间，如果用户不进行登出的相关操作的话，只能等到原来的session默认时间过去自动销毁。