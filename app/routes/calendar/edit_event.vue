<template>
    <div>
    <h1>{{title}}</h1>

    <el-card class="box-card">
       <div class="ms-Grid" v-if="loaded">
    
    <form action="/updateitem" method="get">
    
    <input name="eventId" type="hidden" :value="event.Id"/>
    <input name="newStart" type="hidden" :value="start_date"/>
    <input name="newEnd" type="hidden" :value="end_date"/>

    <div id="event-subject" class="ms-Grid-row">
      <div class="ms-Grid-col ms-u-sm12">
        <div class="ms-TextField">
          <label class="ms-Label">Subject</label>
          <input name="subject" class="ms-TextField-field" :value="event.Subject"/>
        </div>
      </div>
    </div>
    
    <div class="ms-Grid-row">
      <div class="ms-Grid-col ms-u-sm12">
        <div class="ms-TextField">
          <label class="ms-Label">Location</label>
          <input name="location" class="ms-TextField-field" :value="event.Location.DisplayName"/>
        </div>
      </div>
    </div>
    
      <div v-if="event.IsReminderOn" class="ms-Grid-row">
        <div class="ms-Grid-col ms-u-sm12">
          <div class="ms-TextField is-disabled">
            <label class="ms-Label">Reminder minutes before start</label>
            <input class="ms-TextField-field" :value="event.ReminderMinutesBeforeStart"/>
          </div>
        </div>
      </div>
        
   
      <div v-if="attendees.required && attendees.required.length > 0" class="ms-Grid-row">
        <div class="ms-Grid-col ms-u-sm12">
          <div class="ms-TextField is-disabled">
            <label class="ms-Label">Required attendees</label>
            <input class="ms-TextField-field" :value=" attendees.required"/>
          </div>
        </div>
      </div>
    
    
      <div v-if="attendees.optional && attendees.optional.length > 0" class="ms-Grid-row">
        <div class="ms-Grid-col ms-u-sm12">
          <div class="ms-TextField is-disabled">
            <label class="ms-Label">Optional attendees</label>
            <input class="ms-TextField-field" :value="attendees.optional"/>
          </div>
        </div>
      </div>
    
    
      <div v-if="attendees.resources && attendees.resources.length > 0" class="ms-Grid-row">
        <div class="ms-Grid-col ms-u-sm12">
          <div class="ms-TextField is-disabled">
            <label class="ms-Label">Resources</label>
            <input class="ms-TextField-field" :value="attendees.resources"/>
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
        <input type="submit" class="ms-Button ms-Button--primary ms-Button-label" value="Update item"/>
      </div>
      <div class="ms-Grid-col ms-u-sm6">
        <a class="ms-Button ms-Button--primary" :href="'/deleteitem?id=' + event.Id"><span class="ms-Button-label">Delete item</span></a>
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
        this.start_date = this.event.Start.DateTime;
        this.end_date = this.event.End.DateTime;
    
      var att = this.event.Attendees;

      var displayStrings = {
        required: '',
        optional: '',
        resources: ''
      };
      
      att.forEach(function(attendee) {
        var attendeeName = (attendee.EmailAddress.Name === undefined) ? 
          attendee.EmailAddress.Address : attendee.EmailAddress.Name;
        switch (attendee.Type) {
          // Required
          case "Required":
            if (displayStrings.required.length > 0) {
              displayStrings.required += '; ' + attendeeName;
            }
            else {
              displayStrings.required += attendeeName;
            }
            break;
          // Optional
          case "Optional":
            if (displayStrings.optional.length > 0) {
              displayStrings.optional += '; ' + attendeeName;
            }
            else {
              displayStrings.optional += attendeeName;
            }
            break;
          // Resources
          case "Resource":
            if (displayStrings.resources.length > 0) {
              displayStrings.resources += '; ' + attendeeName;
            }
            else {
              displayStrings.resources += attendeeName;
            }
            break;
        }
      });
        
      this.attendees = displayStrings;
      this.loaded = true;
      return this.attendees;

    },
    methods:{
        
    }

}
</script>
