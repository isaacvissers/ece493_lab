# Data Model: Public Final Schedule Announcement

## Entities

### PublicSchedule
- **id**
- **status**: published | unpublished
- **publishedAt**
- **lastUpdatedAt**
- **entries**: [ScheduleEntry]
- **announcementId**

### ScheduleEntry
- **id**
- **day**
- **time**
- **room**
- **session**: track/session label for grouping
- **paperTitle**
- **authors**
- **abstract**
- **isUnscheduled**

### Announcement
- **id**
- **title**
- **summary**
- **scheduleLink**
- **lastUpdatedAt**

### PublicationLog
- **id**
- **timestamp**
- **status**: success | failure
- **errorMessage**
- **context**: publish | render

## Relationships

- PublicSchedule 1 : 0..* ScheduleEntry
- PublicSchedule 1 : 0..1 Announcement
- PublicSchedule 1 : 0..* PublicationLog

## Validation Rules

- If PublicSchedule.status != published, schedule entries are not exposed publicly.
- ScheduleEntry with isUnscheduled = true is labeled “Unscheduled” or omitted per policy.
- PublicationLog entries created on publish or render failure.

## State Transitions

- unpublished → published (admin publish action)
- published → published (update; lastUpdatedAt changes)
- published → unpublished (if roll back; optional)
