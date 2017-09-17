var var1 = '1';// 非空字符串 , 布尔 true , 非0数字， 函数，非 null 对象([] , {} , function)

if(var1){
    console.log('true');
}else{
    console.log('false');
}


var var2 = '';// 空字符串，undefined，null，0，NaN
if(!var2){
    console.log('true');
}else{
    console.log('false');
}