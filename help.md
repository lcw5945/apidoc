# 关于APIDOC #
api文档管理、测试系统

- [登录/注销](#login)

- [项目管理](#projectManagement)
	- [项目列表](#projectList)
		- [导入项目](#projectImport)
		- [导出项目](#projectExport)
		- [新增/修改项目](#projectAddEdit)
		- [删除项目](#projectDelete)
		- [协作管理](#collaborativeManagement)
	- [接口列表](#apiList)
		- [新建/修改接口](#apiAddEdit)
		- [删除接口](#apiDelete)
		- [接口详情](#apiDetail)
		- [测试接口](#apiTest)
		- [批量测试](#apiPtest)
		- [拷贝接口](#apiCopy)
	- [分组/表管理](#groupManagement)
		- [新建/修改 组/表](#groupAddEdit)
		- [删除 组/表](#groupDelete)
	- [状态码文档](#codeList)
		- [新建/修改状态码](#codeAddEdit)
		- [状态码详情](#codeDetail)
		- [删除状态码](#codeDelete)
		- [拷贝状态码](#codeCopy)
	- [数据字典](#database)
		- [新建/修改数据库](#dataAddEdit)
		- [删除数据库](#dataDelete)
	- [字段管理](#fieldManagement)
		- [新建/修改字段](#fieldAddEdit)
		- [删除字段](#fieldDelete)
	- [注册账号（root）](#register)
	- [用户管理（root）](#userManagement)
		- [重置密码](#resetPassword)
		- [删除用户](#userDelete)
- [小工具](#tool)
<br/>
<br/>
## 主要特性 ##
<br/>
- 接口文档管理
- 状态码管理
- 数据字典管理
- 接口测试
- 接口mock功能
<br/>
<br/>

# 登录/注销 <a name="login"></a>
<br/>
apidoc的账号是最高管理员注册好的，有了账号密码就可以登录了

<p  align="center">     <img src="https://i.imgur.com/POvmndt.png" width = "800" height = "400" /> </p>
<br/>

如果你想退出或者切换账号，可以点击顶部导航最右边的菜单里的退出登录

<p  align="center">     <img src="https://i.imgur.com/3CyLfW1.png" /> </p>

<br/>
<br/>	
# 项目管理 <a name="projectManagement"></a>
<br/>

## 项目列表 <a name="projectList"></a>
<br/>
登录成功以后就可以看到项目列表了，在这里可以对已有项目进行操作，也可以新建或者导入apiview的项目

<p  align="center">     <img src="https://i.imgur.com/WWgoyCP.png" width = "800" height = "400" /> </p>
<br/>

### 导入项目 <a name="projectImport"></a>
<br/>

点击导入项目中的导入apiview项目，在弹窗中填入apiview的账号密码确定即可

<p  align="center">     <img src="https://i.imgur.com/PZF8s3g.png" width = "800" height = "400" /> </p>

<br/>
### 导出项目 <a name="projectExport"></a>
<br/>

点击接口文档/状态码文档顶部的导出项目，可以导出对应的json文件

<p  align="center">     <img src="https://i.imgur.com/8PVW5i3.png" /> </p>
<br/>

### 新增/修改项目 <a name="projectAddEdit"></a>
<br/>
点击新增/修改按钮，在弹窗中填入需要填写的内容后点击确定，就完成创建/修改项目了

<p  align="center">     <img src="https://i.imgur.com/a00SriK.png" width = "800" height = "400" /> </p>
<br/>

### 删除项目 <a name="projectDelete"></a>
<br/>
在项目列表的操作栏点击删除按钮，确定后就会删除此项目了

<p  align="center">     <img src="https://i.imgur.com/7ggMN2O.png" /> </p>
<br/>

### 协作管理 <a name="collaborativeManagement"></a>
<br/>
状态码与接口文档的列表页点击协作管理后弹出协作管理弹窗，如果你是项目创建者，便可以添加其他协作者，如果不是创建者则没有操作权限，只能看到此项目的协作者列表。

此为创建者可操作的协作管理弹窗

<p  align="center">     <img src="https://i.imgur.com/hzXSthS.png" /> </p>
<br/>

此为非创建者看的的协作者列表

<p  align="center">     <img src="https://i.imgur.com/c0Usb36.png" /> </p>
<br/>

创建者输入想要添加的协作者用户名点击搜索图标或者回车后可进行添加操作

<p  align="center">     <img src="https://i.imgur.com/DGptksc.png" /> </p>
<br/>

创建者也可以删除添加的协作者

<p  align="center">     <img src="https://i.imgur.com/GSmIfuM.png" /> </p>
<br/>

## 接口列表 <a name="apiList"></a>
<br/>

点击项目列表的某一项目就可以进入到接口列表

<p  align="center">     <img src="https://i.imgur.com/glgWGgQ.png" width = "800" height = "400" /> </p>
<br/>

### 新建/修改接口 <a name="apiAddEdit"></a>
<br/>

点击添加接口/修改按钮就可以进入到对应的添加/修改页面

<p  align="center">     <img src="https://i.imgur.com/r5gj7EL.png" width = "800" height = "400"  /> </p>
<br/>

为接口添加请求参数和返回说明

<p  align="center">     <img src="https://i.imgur.com/RfjTL20.png" width = "800" height = "400" /> </p>
<br/>

请求参数可以设置参数值可能性，方便测试时的请求参数拼接，也可以在测试页面再进行添加，不过测试页面添加的数据不会存入数据库

<p  align="center">     <img src="https://i.imgur.com/HyI0wml.png" width = "800" height = "400" /> </p>
<br/>

在添加/修改接口的页面右上角有接口模板选择，同时也可以进行接口模板管理

<p  align="center">     <img src="https://i.imgur.com/rUC4YqJ.png" /> </p>
<br/>

点击管理接口模板后弹出接口模板管理弹窗，可以对模板进行删除/修改

<p  align="center">     <img src="https://i.imgur.com/0S4mOkJ.png" /> </p>
<br/>

点击修改或者添加按钮进入到修改/新增模板页面

<p  align="center">     <img src="https://i.imgur.com/12ZdXl4.png" width = "800" height = "400" /> </p>
<br/>

### 删除接口 <a name="apiDelete"></a>
<br/>
点击接口删除按钮确定后会将接口放入接口回收站内

<p  align="center">     <img src="https://i.imgur.com/nLMMx3E.png" /> </p>
<br/>

在接口回收站可以看到所有删除的接口，只有项目创建者有权限对接口进行彻底删除，彻底删除确定后接口将不可找回，如果点击恢复按钮，则接口会直接恢复到接口列表内

<p  align="center">     <img src="https://i.imgur.com/ZUHB0wB.png" /> </p>
<br/>

### 接口详情 <a name="apiDetail"></a>
<br/>
在接口列表页点击某个接口进入到接口详情，可以看到接口的详细信息

<p  align="center">     <img src="https://i.imgur.com/0PotBp2.png" width = "800" height = "400" /> </p>
<br/>

### 测试接口 <a name="apiTest"></a>
<br/>
进入到接口详情页后点击测试按钮进入到此接口的测试页面，在此页面可以为当前要测试的接口添加/修改请求头和请求参数

<p  align="center">     <img src="https://i.imgur.com/dDfFJ3X.png" width = "800" height = "400" /> </p> 
<br/>

测试接口页面可以选择测试环境

<p  align="center">     <img src="https://i.imgur.com/wE7J36j.png" /> </p>
<br/>

点击管理测试环境也可以对测试环境进行添加、删除或者修改操作

<p  align="center">     <img src="https://i.imgur.com/K5DiBBg.png" /> </p>
<br/>

点击登录按钮，弹出登录弹出框，填写后点击确定即可发送请求，如已有请求过的记录，则可在登录的账号中进行选择。

入参封装方式有两种分别是，盒饭api-App、盒饭api-H5，两种入参方式都会为请求参数添加‘token’，‘consume’，‘msg’和‘time’字段，不同的是api-App会多添加请求头authinfo字段。

当前账号数据展示，点击重新选择可以选择该接口返回的数据，勾选后，可在下面展示，点击后即可复制，方便在下面的请求参数中使用。

<p  align="center">     <img src="https://i.imgur.com/QY3Lpne.png" width = "800" /> </p>
<br/>

点击发送后会在返回结果区域显示返回结果，并且在底部请求历史列表添加一行当前测试的历史数据，点击一条历史记录可以还原这条记录的历史请求数据。

<p  align="center">     <img src="https://i.imgur.com/EJULsLT.png" width = "800" height = "400" /> </p>
<br/>

点击历史记录上的“添加到批处理”，会弹出添加断言对话框，填写后“添加到批处理”处为勾选状态，反之取消此处勾选状态。

<p  align="center">     <img src="https://i.imgur.com/IwckTxN.png" width = "800" /> </p>
<br/>

点击修改断言会弹出修改断言对话框，可对断言进行添加、修改或删除。

<p  align="center">     <img src="https://i.imgur.com/9E3E30X.png" /> </p>
<br/>

### 批量测试 <a name="apiPtest"></a>
<br/>
在接口列表页点击接口批量测试进入到批量测试，在此页面可测该项目组中同环境下，有历史记录并且勾选了添加到批测试的所有接口。

需测试列表中，点击修改断言按钮，可对断言进行修改，点击删除按钮，取消此条历史记录中添加到批测试的勾选状态。

<p  align="center">     <img src="https://i.imgur.com/Jvn1Bmn.png" width = "800" height = "400" /> </p>
<br/>

返回结果列表中，只会展示接口返回错误或断言失败的接口信息，接口信息包括返回结果和测试未通过原因。

<p  align="center">     <img src="https://i.imgur.com/9E9UMa6.png" width = "800" height = "400" /> </p>
<br/>


### 拷贝接口 <a name="apiCopy"></a>
<br/>

点击拷贝按钮，即可进行接口拷贝

<p  align="center">     <img src="https://i.imgur.com/2lmfZFa.png" /> </p>
<br/>

点击拷贝按钮后会自动创建一条跟原接口一样的副本接口，弹窗询问是否立即修改，如果确定会跳转到修改接口页面进行修改，如若取消还会留在接口列表页

<p  align="center">     <img src="https://i.imgur.com/wJaWoyH.png" width = "800" /> </p>
<br/>

## 分组/表管理 <a name="groupManagement"></a>
<br/>

在接口详情页面、状态码详情页面均有分组功能；在状态码页面有建表功能。这两类功能类似，在此统一说明。


### 新建/修改 组/表 <a name="groupAddEdit"></a>
<br/>

在左边菜单点击 新建或修改 按钮，打开编辑组/表的弹出框，只要输入分组/表名称后，点击确定按钮，保存成功。

<p  align="center">     <img src="https://i.imgur.com/ovHMiKK.png" width = "800" height = "400" /> </p>
<br/>

### 删除 组/表 <a name="groupDelete"></a>
<br/>

选择组后，点击![](https://i.imgur.com/8s9cf1K.png) 按钮，出现修改和删除按钮；点击"删除"按钮，弹出删除确认框，点击"确定"按钮删除成功。

<p  align="center">     <img src="https://i.imgur.com/NhSjwS2.png" width = "800" height = "400" /> </p>
<br/>
<br/>


## 状态码文档 <a name="codeList"></a>
<br/>
### 新建/修改状态码 <a name="codeAddEdit"></a>
<br/>

点击添加接口/修改按钮就可以进入到状态码编辑页面。

<p  align="center">     <img src="https://i.imgur.com/UwRaZtd.png" width = "800" height = "400" /> </p>
<br/>


### 状态码详情 <a name="codeDetail"></a>
<br/>
在状态列表，点击某一状态码，进入状态码详情页。

<p  align="center">     <img src="https://i.imgur.com/4iNoDr3.png" width = "800" height = "400" /> </p>
<br/>


### 删除状态码 <a name="codeDelete"></a>
<br/>
在状态码列表，点击删除按钮，弹出删除确认框，确定后即可删除。

<p  align="center">     <img src="https://i.imgur.com/SyVJQ1v.png" /> </p>
<br/>

### 拷贝状态码 <a name="codeCopy"></a>
<br/>

在状态码列表，点击"拷贝"按钮，拷贝成功，弹出"确定现在修改拷贝的状态码吗？"提示框，点击"确定"按钮进入拷贝后的状态码的修改页，进行修改。

<p  align="center">     <img src="https://i.imgur.com/IkzyZQj.png" width = "800" /> </p>
<br/>
<br/>


## 数据字典 <a name="database"></a>
<br/>


### 新建/修改数据库 <a name="dataAddEdit"></a>
<br/>

点击"新增数据库"按钮或"修改"按钮，弹出编辑数据库的弹出框。

<p  align="center">     <img src="https://i.imgur.com/1QyEEHE.png" /> </p>
<br/>

### 删除数据库 <a name="dataDelete"></a>
<br/>

在数据库列表，点击删除按钮，弹出确认框，点击确定即可删除。


<p  align="center">     <img src="https://i.imgur.com/Uwn814x.png" /> </p>
<br/>
<br/>

## 字段管理 <a name="fieldManagement"></a>
<br/>

在编辑字段之前，需要先建表。


### 新建/修改字段 <a name="fieldAddEdit"></a>
<br/>

点击"添加字段"按钮或"修改"按钮，弹出字段编辑对话框。

<p  align="center">     <img src="https://i.imgur.com/lnMWCmm.png" /> </p>
<br/>



### 删除字段 <a name="fieldDelete"></a>
<br/>

在字段列表，点击删除按钮，弹出确认框，点击确定即可删除。

<p  align="center">     <img src="https://i.imgur.com/GvkHKwo.png" /> </p>
<br/>
<br/>


## 注册账号（root） <a name="register"></a>
<br/>

只有管理员有注册账号权限，点击右上角菜单的注册账号，打开注册用户页面。

<p  align="center">     <img src="https://i.imgur.com/K5vbI2i.png" width = "800" height = "400" /> </p>
<br/>
<br/>


## 用户管理（root） <a name="userManagement"></a>
<br/>


只有管理员有用户管理权限，点击右上角菜单的用户管理，打开用户管理页面。

<p  align="center">     <img src="https://i.imgur.com/mGIzxqD.png" /> </p>
<br/>

用户管理页面

<p  align="center">     <img src="https://i.imgur.com/ehe1Wpf.png" width = "800" height = "400" /> </p>
<br/>


### 重置密码 <a name="resetPassword"></a>
<br/>

用户点击右上角菜单的账号管理，打开重置密码页面。

<p  align="center">     <img src="https://i.imgur.com/EV34l7b.png" /> </p>
<br/>

输入旧密码，新密码，确认新密码保存即可。

<p  align="center">     <img src="https://i.imgur.com/fn52Rhh.png" width = "800" height = "400" /> </p>
<br/>

重置之后，弹出提醒框。

<p  align="center">     <img src="https://i.imgur.com/nenRBOV.png" /> </p>
<br/>


### 删除用户 <a name="userDelete"></a>
<br/>

在用户管理页面，点击删除按钮，弹出删除提醒框，点击确定即可删除。

<p  align="center">     <img src="https://i.imgur.com/DIS7rQ5.png" width = "800" /> </p>
<br/>
<br/>



# 小工具 <a name="tool"></a>
<br/>
点击导航栏的小工具按钮可以进入到小工具页面，点击对应模块即可进入到对应功能模块

<p  align="center">     <img src="https://i.imgur.com/v1TEBeT.png" /> </p>