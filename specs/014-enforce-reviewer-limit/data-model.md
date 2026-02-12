# Data Model: Enforce Reviewer Assignment Limit

**Date**: 2026-02-03
**Feature**: /home/ivissers/ece_493/labs/lab2/lab2/specs/014-enforce-reviewer-limit/spec.md

## Entities

### Reviewer
- **Fields**:
  - `reviewerId` (string, unique)
  - `email` (string, unique)
  - `activeAssignmentCount` (number, derived or stored)
- **Constraints**:
  - `activeAssignmentCount` MUST be <= 5
  - Email uniqueness required

### Paper
- **Fields**:
  - `paperId` (string, unique)
  - `status` (enum: submitted, eligible, in_review, withdrawn, completed)
- **Constraints**:
  - Only eligible papers can be assigned reviewers
  - No conference association at assignment time

### Assignment
- **Fields**:
  - `assignmentId` (string, unique)
  - `paperId` (string, required)
  - `reviewerId` (string, required)
  - `status` (enum: active, completed, withdrawn)
  - `assignedAt` (timestamp)
- **Constraints**:
  - Only one active assignment per (paperId, reviewerId)
  - Active assignments count toward the reviewer limit

## Relationships

- Reviewer 1 : 0..* Assignment (active assignments drive workload limit)
- Paper 1 : 0..* Assignment (multiple reviewers per paper)

## Validation Rules

- Assignments MUST be blocked if reviewer has 5 active assignments.
- Assignments MUST be blocked when reviewer count cannot be determined.
- Assignments MUST be blocked if persistence fails.

## State Transitions

- Assignment: `active` -> `completed` or `withdrawn`
- Paper: `submitted` -> `eligible` -> `in_review` -> `completed` (or `withdrawn`)
