<template>
    <div>
        <h1>{{title}}</h1>
        <h2>Login as {{email}}</h2>    
  <div class="ms-Grid">
    <div id="table-row" class="ms-Grid-row">
        <table>
            <thead>
                <th>Change type</th>
                <th>Details</th>
                <th></th>
            </thead>
            <tbody>
                <tr v-for="(dt, key) in data" :key="key">
                    <td>{{changeType(dt)}}</td>
                    <td>{{detail(dt)}}</td>
                    <td v-html="getViewItemLink(dt)"></td>
                </tr>

            </tbody>
        </table>

  </div>
</div>
       
    </div>
</template>

<script>

export default {
    data: function () {
        return {
            title: ''
        }
    },
    mounted(){
        console.log(this.data);
    },
    methods:{
        changeType(dt){
            if(dt.reason === 'Deleted'){
                return 'Delete';
            }else{
                return 'Add/Update';
            }
        },
        detail(dt){
           var changeType = this.changeType(dt);
           var detail = '';
           if (changeType == 'Delete'){
             detail = this.extractId(dt);
           }else{
            detail = dt.Subject;
           }         
           return detail;
        },
        extractId(dt){
              return dt.id.match(/'([^']+)'/)[1];
        },
        getViewItemLink(dt){
             //var querystring = require('querystring');

             if (dt.reason && dt.reason === 'deleted') {
                return '';
                }

                var link = '<a href="/viewitem?id='+dt.Id;
                //link += querystring.stringify({ id: dt.Id });
                link += '">View Item</a>';
                return link;

        }
    }
}
</script>
