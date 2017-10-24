<template>
    <section class="section icsbuilder">

        <div class="container is-widescreen">

            <div class="level">
                <h1 class="level-item has-text-centered title is-1">.ics Builder</h1>
            </div>

            <div class="tabs">
                <ul>
                    <li :class="{'is-active': currentChapter == 'general'}" @click="currentChapter = 'general'"><a>General</a></li>
                    <li :class="{'is-active': currentChapter == 'repetition'}" @click="currentChapter = 'repetition'"><a>Repetition</a></li>
                    </ul>
            </div>

            <div class="columns" v-show="currentChapter == 'general'">

                <div class="column is-6">
                    <div class="field">
                        <label class="label">Event title</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Title" v-model="title">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Location</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Location" v-model="location">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Description</label>
                        <div class="control">
                            <textarea class="textarea" placeholder="Description" v-model="description"></textarea>
                        </div>
                    </div>
                </div>

                <div class="column is-6">
                    <div class="field">
                        <label class="label">Start date</label>
                        <div class="control">
                            <div class="field has-addons">
                                <datepicker placeholder="Select start date" :config="{ enableTime: true, time_24hr: true }" readonly v-model="dateStart" />
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">End date</label>
                        <div class="control">
                            <div class="field has-addons">
                                <datepicker placeholder="Select end date" :config="{ enableTime: true, time_24hr: true }" readonly v-model="dateEnd" />
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Time zone</label>
                        <div class="control has-icons-left">
                            <div class="select">
                                <select v-model="timezone">
                                    <option v-for="tz of timeZones">{{tz}}</option>
                                </select>
                            </div>
                            <div class="icon is-small is-left">
                                <i class="fa fa-globe"></i>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Reminder</label>
                        <div class="control has-icons-left">
                            <label class="checkbox">
                            <input type="checkbox" v-model="reminder">
                                When the event starts
                            </label>
                        </div>
                    </div>
                </div>

            </div>

            <div class="columns" v-show="currentChapter == 'repetition'">

                <div class="column is-6">
                    <div class="field">
                        <label class="label">Number of repetitions</label>
                        <div class="control">
                            <input class="input" type="number" placeholder="No. of repetitions" value="0" v-model.number="repetitions">
                        </div>
                    </div>
                </div>

                <div class="column is-6">
                    <div class="field">
                        <label class="label">Days of week</label>
                        <div class="control">
                            <div class="select is-multiple">
                                <select multiple size="7" v-model="dow">
                                    <option value="MO">Monday</option>
                                    <option value="TU">Tuesday</option>
                                    <option value="WE">Wednesday</option>
                                    <option value="TH">Thursday</option>
                                    <option value="FR">Friday</option>
                                    <option value="SA">Saturday</option>
                                    <option value="SU">Sunday</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="level">
                <div class="level-item level-right">
                    <a class="button is-primary" :href="href" download="calendar.ics">Download</a>
                </div>
            </div>

        </div>
    </section>
</template>

<script>
    import Datepicker from 'vue-bulma-datepicker'
    import moment from 'moment'
    import {Base64} from 'js-base64'
    import uuidv4 from 'uuid/v4'
    import _ from 'lodash'

    export default {
        directives: {
        },
        components: {
            Datepicker
        },
        props: [
        ],
        computed: {
            href: function() {
                if (_.isEmpty(this.dateStart) || _.isEmpty(this.dateEnd)) {
                    return ''
                }

                let lines = []

                lines.push('BEGIN:VCALENDAR')
                lines.push('CALSCALE:GREGORIAN')
                lines.push('VERSION:2.0')
                lines.push('X-WR-CALNAME:' + this.title)
                lines.push('METHOD:PUBLISH')
                lines.push('BEGIN:VEVENT')
                lines.push('TRANSP:OPAQUE')
                let calendarUUID = uuidv4()
                lines.push('UID:' + calendarUUID)
                lines.push('DTSTAMP:' + moment().format('YYYYMMDDTHHmmSS') + 'Z')
                lines.push('LOCATION:' + this.location)
                lines.push('DESCRIPTION:' + this.description.replace(/\n/g, '\\n'))
                lines.push('SEQUENCE:0')
                lines.push('SUMMARY:' + this.title)
                let dtStart = 'DTSTART'
                if (this.timezone !== 'Time zone independent') {
                    dtStart += ';TZID=' + this.timezone
                }
                dtStart += ':' + moment(this.dateStart).format('YYYYMMDDTHHmmSS')

                lines.push(dtStart)

                let dtEnd = 'DTEND'
                if (this.timezone !== 'Time zone independent') {
                    dtEnd += ';TZID=' + this.timezone
                }
                dtEnd += ':' + moment(this.dateEnd).format('YYYYMMDDTHHmmSS')

                lines.push(dtEnd)
                lines.push('CREATED:' + moment().format('YYYYMMDDTHHmmSS') + 'Z')

                if (this.repetitions > 0) {
                    lines.push('RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=' + this.repetitions + ';BYDAY=' + this.dow.join(','))
                }

                if (this.reminder) {
                    lines.push('BEGIN:VALARM')
                    let reminderUUID = uuidv4()
                    lines.push('X-WR-ALARMUID:' + reminderUUID)
                    lines.push('UID:' + reminderUUID)
                    lines.push('TRIGGER:PT0S')
                    lines.push('DESCRIPTION:' + this.title)
                    lines.push('ACTION:DISPLAY')
                    lines.push('END:VALARM')
                }

                lines.push('END:VEVENT')
                lines.push('END:VCALENDAR')

                return 'data:application/octet-stream;base64,' + Base64.encode(lines.join('\n'))
            }
        },
        data: function() {
            return {
                currentChapter: 'general',
                timeZones: ['Time zone independent'].concat(moment.tz.names()),
                title: '',
                location: '',
                description: '',
                dateStart: '',
                dateEnd: '',
                timezone: 'Time zone independent',
                reminder: true,
                repetitions: 0,
                dow: []
            }
        },
        beforeMount: function() {

        },
        methods: {
        }
    }
</script>

<style type="scss" scoped>

</style>