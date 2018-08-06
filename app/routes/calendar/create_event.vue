<template>
    <div>
    <h1>{{title}}</h1>

    <el-card class="box-card">
       <div class="ms-Grid">
    
    <form action="/createItem" method="get">
    
    <input name="newStart" type="hidden" :value="start_date"/>
    <input name="newEnd" type="hidden" :value="end_date"/>

    <div id="event-subject" class="ms-Grid-row">
      <div class="ms-Grid-col ms-u-sm12">
        <div class="ms-TextField">
          <label class="ms-Label">Subject</label>
          <input name="subject" class="ms-TextField-field" value=""/>
        </div>
      </div>
    </div>
    
    <div class="ms-Grid-row">
      <div class="ms-Grid-col ms-u-sm12">
        <div class="ms-TextField">
          <label class="ms-Label">Location</label>
          <input name="location" class="ms-TextField-field" value=""/>
        </div>
      </div>
    </div>   
    
    <div class="ms-Grid-row">
      <div class="ms-Grid-col ms-u-sm6">
        <div class="ms-TextField is-disabled">
          <label class="ms-Label">Start</label>
          <el-date-picker
      v-model="start_date"
      type="datetime"
      placeholder="Select date and time">
    </el-date-picker>

        </div>
      </div>
      <div class="ms-Grid-col ms-u-sm6">
        <div class="ms-TextField is-disabled">
          <label class="ms-Label">End</label>
           <el-date-picker
      v-model="end_date"
      type="datetime"
      placeholder="Select date and time">
    </el-date-picker>

        </div>
      </div>
    </div>
    
    <div id="action-buttons" class="ms-Grid-row">
      <div class="ms-Grid-col ms-u-sm6">
        <input type="submit" class="ms-Button ms-Button--primary ms-Button-label" value="Create item"/>
      </div>
    </div>
    </form>
    
    </div>
    
    </el-card>

    </div>
</template>

<script>

export default {
    data: function () {
        return {
            title: '',
            attendees: '',
            loaded: false,
            start_date: '',
            end_date: ''
        }
    },
    mounted(){
   
    },
    methods:{
        
    }

}
</script>
