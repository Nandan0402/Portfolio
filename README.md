<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Nandan B | Portfolio</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<style>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Arial, Helvetica, sans-serif;
}
body{
  background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);
  color:#fff;
  line-height:1.7;
}
.container{
  max-width:1100px;
  margin:auto;
  padding:40px 20px;
}
header{
  text-align:center;
}
header h1{
  font-size:42px;
}
header p{
  font-size:18px;
  margin-top:10px;
}
.icon-row{
  text-align:center;
  margin:30px 0;
}
.icon-row i{
  font-size:48px;
  margin:0 12px;
}
.fa-python{color:#ffd43b;}
.fa-html5{color:#e34c26;}
.fa-css3-alt{color:#2965f1;}
.fa-brain{color:#00e5ff;}

section{
  margin-top:60px;
}
section h2{
  font-size:30px;
  margin-bottom:15px;
  border-bottom:2px solid #00e5ff;
  display:inline-block;
  padding-bottom:5px;
}
.card{
  background:rgba(255,255,255,0.12);
  padding:25px;
  border-radius:10px;
  margin-top:20px;
}
.badges img{
  height:32px;
  margin:5px;
}
ul{
  margin-left:20px;
}
li{
  margin:8px 0;
}
.table{
  width:100%;
  border-collapse:collapse;
  margin-top:15px;
}
.table th,.table td{
  border:1px solid rgba(255,255,255,0.3);
  padding:10px;
  text-align:left;
}
.btn{
  display:inline-block;
  background:#00e5ff;
  color:#000;
  padding:12px 20px;
  border-radius:6px;
  font-weight:bold;
  text-decoration:none;
  margin-top:10px;
}
.btn:hover{
  background:#1de9b6;
}
footer{
  text-align:center;
  margin-top:60px;
  padding:20px;
  background:rgba(0,0,0,0.4);
}
a{color:#00e5ff;}
</style>
</head>

<body>

<div class="container">

<header>
  <h1>🚀 Nandan B – Portfolio</h1>
  <p>BCA Student | Web Developer | Machine Learning Enthusiast</p>
</header>

<div class="icon-row">
  <i class="fa-brands fa-python"></i>
  <i class="fa-brands fa-html5"></i>
  <i class="fa-brands fa-css3-alt"></i>
  <i class="fa-solid fa-brain"></i>
</div>

<!-- ABOUT -->
<section>
<h2>👨‍💻 About Me</h2>
<div class="card">
<p>
I am a passionate and disciplined student focused on mastering 
<strong>Web Development</strong> and <strong>Machine Learning fundamentals</strong>.
I believe in strong basics, clean design, and real-world project building.
</p>
</div>
</section>

<!-- PROJECT OVERVIEW -->
<section>
<h2>🚢 Featured Project – Titanic Survival Prediction</h2>
<div class="card">
<p>
A Machine Learning classification project that predicts passenger survival
using <strong>Logistic Regression</strong>.
</p>

<ul>
<li>✔ Data preprocessing & cleaning</li>
<li>✔ Feature encoding</li>
<li>✔ Model training & evaluation</li>
<li>✔ Accuracy & confusion matrix analysis</li>
</ul>

<a class="btn" href="https://github.com/Nandan0402" target="_blank">
<i class="fa-brands fa-github"></i> View Project
</a>
</div>
</section>

<!-- DATASET -->
<section>
<h2>📂 Dataset Information</h2>
<div class="card">
<table class="table">
<tr><th>Column</th><th>Description</th></tr>
<tr><td>PassengerId</td><td>Unique ID</td></tr>
<tr><td>Pclass</td><td>Ticket class</td></tr>
<tr><td>Sex</td><td>Gender</td></tr>
<tr><td>Age</td><td>Passenger age</td></tr>
<tr><td>Fare</td><td>Ticket fare</td></tr>
<tr><td>Survived</td><td>Target variable</td></tr>
</table>
</div>
</section>

<!-- SKILLS -->
<section>
<h2>🛠️ Skills & Technologies</h2>
<div class="card badges">
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/Machine%20Learning-00E5FF?style=for-the-badge">
</div>
</section>

<!-- CERTIFICATE -->
<section>
<h2>📜 Certifications</h2>
<div class="card">
<a class="btn" href="css-cert.png" target="_blank">
<i class="fa-solid fa-certificate"></i> View CSS Certificate
</a>
</div>
</section>

<!-- CONTACT -->
<section>
<h2>📫 Contact</h2>
<div class="card">
<p><i class="fa-solid fa-envelope"></i> your-email@example.com</p>
<p><i class="fa-brands fa-github"></i> 
<a href="https://github.com/Nandan0402" target="_blank">GitHub</a></p>
<p><i class="fa-brands fa-linkedin"></i> 
<a href="https://www.linkedin.com/in/nandan-b-2a9b1b334/" target="_blank">LinkedIn</a></p>
</div>
</section>

<footer>
<p>⭐ Built with strong fundamentals | © 2026 Nandan B</p>
</footer>

</div>
</body>
</html>
