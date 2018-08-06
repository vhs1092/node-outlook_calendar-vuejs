<template>
    <div>
        <h1>{{title}}</h1>
        <h2>Login as {{email}}</h2>    
    <div class="ms-Grid-row"> 
    <div class="ms-Grid-col ms-u-sm4"> 
      <a class="ms-Button ms-Button--primary" href="/sync"><span class="ms-Button-label">Sync calendar</span></a>' 
    </div>  
    <div class="ms-Grid-col ms-u-sm4"> 
      <a class="ms-Button ms-Button--primary" href="/createEvent"><span class="ms-Button-label">Create Event</span></a>' 
    </div> 
    <!--div class="ms-Grid-col ms-u-sm4"> 
      <a class="ms-Button ms-Button--primary" href="/refreshtokens"><span class="ms-Button-label">Refresh tokens</span></a> 
    </div--> 
    <div class="ms-Grid-col ms-u-sm4"> 
      <a class="ms-Button ms-Button--primary" href="/logout"><span class="ms-Button-label">Logout</span></a> 
    </div> 
  </div>
        <!--p><a href="/post">Click here for an example of a Post</a></p>
        <p><a href="/todo">TodoMVC</a></p-->
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            title: ''
        }
    }
}
</script>
