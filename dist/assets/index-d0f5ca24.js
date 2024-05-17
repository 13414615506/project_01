import{u as me}from"./setting-07e2b429.js";import{J as x,d as pe,r as i,c as ce,G as fe,e as c,o as E,f as T,g as l,w as t,h as r,C,j as m,m as S,t as D,v as Z,n as ve,F,q as ge,z as G,K as U,p as _e,k as be,_ as ye}from"./index-c7a0cc4e.js";const Ve=(u,d,y)=>x.get(`/admin/acl/user/${u}/${d}/${y}`),we=u=>u.id?x.post("/admin/acl/user/update",u):x.post("/admin/acl/user",u),he=u=>x.get("/admin/acl/role/"+u),Ce=u=>x.post("/admin/acl/user/doAssignRole",u),xe=u=>x.delete("/admin/acl/user/remove/"+u),Ue=u=>x.delete("/admin/acl/user/batchRemove",{data:u}),ke=u=>(_e("data-v-35f8851e"),u=u(),be(),u),ze={style:{flex:"auto"}},Ee=ke(()=>S("h4",null,"分配角色(职位)",-1)),Se={style:{flex:"auto"}},qe=pe({__name:"index",setup(u){let d=i(1),y=i(5),N=i(0),z=i([]),_=i(!1),b=i(!1),k=i([]),V=i([]),s=ce({username:"",name:"",password:"",mobile:"",email:""}),q=i([]),f=i(),w=i(""),j=me();fe(()=>{h()});const h=async(n=1)=>{d.value=n;let e=await Ve(d.value,y.value,w.value);e.code==200&&(N.value=e.data.total,z.value=e.data.records)},H=()=>{h()},J=()=>{_.value=!0,Object.assign(s,{id:0,username:"",name:"",password:"",email:"",mobile:""}),G(()=>{f.value.clearValidate("username"),f.value.clearValidate("name"),f.value.clearValidate("password"),f.value.clearValidate("email"),f.value.clearValidate("mobile")})},K=n=>{_.value=!0,Object.assign(s,n),G(()=>{f.value.clearValidate("username"),f.value.clearValidate("name"),f.value.clearValidate("email"),f.value.clearValidate("mobile")})},Q=async()=>{await f.value.validate(),(await we(s)).code==200?(_.value=!1,U({type:"success",message:s.id?"更新成功":"添加成功"}),window.location.reload()):(_.value=!1,U({type:"error",message:s.id?"更新失败":"添加失败"}))},W=()=>{_.value=!1},X={username:[{required:!0,trigger:"blur",validator:(n,e,o)=>{e.trim().length>=2?o():o(new Error("用户名字至少五位"))}}],name:[{required:!0,trigger:"blur",validator:(n,e,o)=>{e.trim().length>=2?o():o(new Error("用户昵称至少五位"))}}],password:[{required:!0,trigger:"blur",validator:(n,e,o)=>{e.trim().length>=6?o():o(new Error("用户密码至少六位"))}}],email:[{required:!0,trigger:"blur",validator:(n,e,o)=>{if(e==="")o(new Error("请正确填写邮箱"));else{if(e!=="请正确填写邮箱"){var p=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;p.test(e)||o(new Error("邮箱地址格式不对"))}o()}}}],mobile:[{required:!0,trigger:"blur",validator:(n,e,o)=>{/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(e)?o():o(new Error("请输入正确的手机号"))}}]},Y=async n=>{Object.assign(s,n);let e=await he(s.id);e.code==200&&(k.value=e.data.allRolesList,V.value=e.data.assignRoles,b.value=!0)},R=i(!1),A=i(!0),B=n=>{V.value=n?k.value:[],A.value=!1},ee=n=>{R.value=n.length===k.value.length,A.value=n.length!==k.value.length},le=async()=>{let n={userId:s.id,roleIdList:V.value.map(o=>o.id)};(await Ce(n)).code==200&&(U({type:"success",message:"分配职务成功"}),b.value=!1,h(d.value))},ae=async n=>{(await xe(n)).code==200&&(U({type:"success",message:"删除成功"}),h(z.value.length>1?d.value:d.value-1))},te=n=>{q.value=n},oe=async()=>{let n=q.value.map(o=>o.id),e=await Ue(n);e.code==200?(U({type:"success",message:"删除成功"}),h(z.value.length>1?d.value:d.value-1)):e.code==201&&U({type:"error",message:"操作失败，请联系系统管理员！"})},re=()=>{h(),w.value=""},ne=()=>{j.refsh=!j.refsh};return(n,e)=>{const o=c("el-input"),p=c("el-form-item"),v=c("el-button"),I=c("el-form"),L=c("el-card"),g=c("el-table-column"),se=c("el-popconfirm"),ue=c("el-table"),de=c("el-pagination"),M=c("el-drawer"),O=c("el-checkbox"),ie=c("el-checkbox-group");return E(),T(F,null,[l(L,{style:{height:"80px"}},{default:t(()=>[l(I,{inline:!0,class:"form"},{default:t(()=>[l(p,{label:"用户名:"},{default:t(()=>[l(o,{placeholder:"请你输入搜索用户名",modelValue:r(w),"onUpdate:modelValue":e[0]||(e[0]=a=>C(w)?w.value=a:w=a)},null,8,["modelValue"])]),_:1}),l(p,null,{default:t(()=>[l(v,{type:"primary",size:"default",disabled:!r(w),onClick:re},{default:t(()=>[m("搜索")]),_:1},8,["disabled"]),l(v,{type:"primary",size:"default",onClick:ne},{default:t(()=>[m("重置")]),_:1})]),_:1})]),_:1})]),_:1}),l(L,{style:{margin:"10px 0px"}},{default:t(()=>[l(v,{type:"primary",size:"default",onClick:J},{default:t(()=>[m("添加用户")]),_:1}),l(v,{type:"primary",size:"default",disabled:!r(q).length,onClick:oe},{default:t(()=>[m("批量删除")]),_:1},8,["disabled"]),l(ue,{onSelectionChange:te,style:{margin:"10px 0px"},border:"",data:r(z)},{default:t(()=>[l(g,{type:"selection",align:"center"}),l(g,{label:"#",align:"center",type:"index"}),l(g,{label:"ID",align:"center",prop:"id"}),l(g,{label:"用户姓名",align:"center",prop:"username","show-overflow-tooltip":""}),l(g,{label:"用户别名",align:"center",prop:"name","show-overflow-tooltip":""}),l(g,{label:"手机",align:"center",prop:"mobile","show-overflow-tooltip":""}),l(g,{label:"Email",align:"center",prop:"email","show-overflow-tooltip":""}),l(g,{label:"用户角色",align:"center",prop:"roleName","show-overflow-tooltip":""}),l(g,{label:"创建时间",align:"center",prop:"createTime","show-overflow-tooltip":""}),l(g,{label:"更新时间",align:"center",prop:"updateTime","show-overflow-tooltip":""}),l(g,{label:"操作",width:"300px",align:"center"},{default:t(({row:a,$index:$})=>[l(v,{type:"primary",size:"small",icon:"User",onClick:P=>Y(a)},{default:t(()=>[m("分配角色")]),_:2},1032,["onClick"]),l(v,{type:"primary",size:"small",icon:"Edit",onClick:P=>K(a)},{default:t(()=>[m("编辑")]),_:2},1032,["onClick"]),l(se,{title:`你确定要删除${a.username}?`,width:"260px",onConfirm:P=>ae(a.id)},{reference:t(()=>[l(v,{type:"primary",size:"small",icon:"Delete"},{default:t(()=>[m("删除")]),_:1})]),_:2},1032,["title","onConfirm"])]),_:1})]),_:1},8,["data"]),l(de,{"current-page":r(d),"onUpdate:currentPage":e[1]||(e[1]=a=>C(d)?d.value=a:d=a),"page-size":r(y),"onUpdate:pageSize":e[2]||(e[2]=a=>C(y)?y.value=a:y=a),"page-sizes":[5,7,9,11],background:!0,layout:"prev, pager, next, jumper,->,sizes,total",total:r(N),onCurrentChange:h,onSizeChange:H},null,8,["current-page","page-size","total"])]),_:1}),l(M,{modelValue:r(_),"onUpdate:modelValue":e[8]||(e[8]=a=>C(_)?_.value=a:_=a)},{header:t(()=>[S("h4",null,D(r(s).id?"更新用户":"添加用户"),1)]),default:t(()=>[l(I,{model:r(s),rules:X,ref_key:"formRef",ref:f},{default:t(()=>[l(p,{label:"用户姓名",prop:"username"},{default:t(()=>[l(o,{placeholder:"请您输入用户姓名",modelValue:r(s).username,"onUpdate:modelValue":e[3]||(e[3]=a=>r(s).username=a)},null,8,["modelValue"])]),_:1}),l(p,{label:"用户昵称",prop:"name"},{default:t(()=>[l(o,{placeholder:"请您输入用户昵称",modelValue:r(s).name,"onUpdate:modelValue":e[4]||(e[4]=a=>r(s).name=a)},null,8,["modelValue"])]),_:1}),r(s).id?ve("",!0):(E(),Z(p,{key:0,label:"用户密码",prop:"password"},{default:t(()=>[l(o,{placeholder:"请您输入用户密码",modelValue:r(s).password,"onUpdate:modelValue":e[5]||(e[5]=a=>r(s).password=a)},null,8,["modelValue"])]),_:1})),l(p,{label:"用户手机",prop:"mobile"},{default:t(()=>[l(o,{placeholder:"请您输入用户手机",modelValue:r(s).mobile,"onUpdate:modelValue":e[6]||(e[6]=a=>r(s).mobile=a),modelModifiers:{number:!0}},null,8,["modelValue"])]),_:1}),l(p,{label:"用户邮箱",prop:"email"},{default:t(()=>[l(o,{placeholder:"请您输入用户邮箱",modelValue:r(s).email,"onUpdate:modelValue":e[7]||(e[7]=a=>r(s).email=a)},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),footer:t(()=>[S("div",ze,[l(v,{onClick:W},{default:t(()=>[m("取消")]),_:1}),l(v,{type:"primary",onClick:Q},{default:t(()=>[m("确定")]),_:1})])]),_:1},8,["modelValue"]),l(M,{modelValue:r(b),"onUpdate:modelValue":e[13]||(e[13]=a=>C(b)?b.value=a:b=a)},{header:t(()=>[Ee]),default:t(()=>[l(I,null,{default:t(()=>[l(p,{label:"用户姓名"},{default:t(()=>[l(o,{modelValue:r(s).username,"onUpdate:modelValue":e[9]||(e[9]=a=>r(s).username=a),disabled:!0},null,8,["modelValue"])]),_:1}),l(p,{label:"职位列表"},{default:t(()=>[l(O,{onChange:B,modelValue:R.value,"onUpdate:modelValue":e[10]||(e[10]=a=>R.value=a),indeterminate:A.value},{default:t(()=>[m("全选")]),_:1},8,["modelValue","indeterminate"]),l(ie,{modelValue:r(V),"onUpdate:modelValue":e[11]||(e[11]=a=>C(V)?V.value=a:V=a),onChange:ee},{default:t(()=>[(E(!0),T(F,null,ge(r(k),(a,$)=>(E(),Z(O,{key:$,label:a},{default:t(()=>[m(D(a.roleName),1)]),_:2},1032,["label"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1})]),footer:t(()=>[S("div",Se,[l(v,{onClick:e[12]||(e[12]=a=>C(b)?b.value=!1:b=!1)},{default:t(()=>[m("取消")]),_:1}),l(v,{type:"primary",onClick:le},{default:t(()=>[m("确定")]),_:1})])]),_:1},8,["modelValue"])],64)}}});const Oe=ye(qe,[["__scopeId","data-v-35f8851e"]]);export{Oe as default};
