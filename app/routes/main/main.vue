<template>
    <div>
        <h1>{{title}}</h1>
        
        <a id="signin-button" class="ms-Button ms-Button--primary" :href="signinUrl"><span class="ms-Button-label">Click here to sign in</span></a>

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
