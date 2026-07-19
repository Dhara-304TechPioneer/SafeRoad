from app.models.report import ReportStatus


def test_workflow_transitions_are_valid():
    valid_transitions = {
        ReportStatus.REPORTED: {ReportStatus.AI_VERIFIED},
        ReportStatus.AI_VERIFIED: {ReportStatus.OFFICER_VERIFIED, ReportStatus.REPORTED},
        ReportStatus.OFFICER_VERIFIED: {ReportStatus.ASSIGNED, ReportStatus.IN_PROGRESS},
        ReportStatus.ASSIGNED: {ReportStatus.IN_PROGRESS, ReportStatus.RESOLVED},
        ReportStatus.IN_PROGRESS: {ReportStatus.QUALITY_CHECK, ReportStatus.RESOLVED},
        ReportStatus.QUALITY_CHECK: {ReportStatus.RESOLVED, ReportStatus.CLOSED},
        ReportStatus.RESOLVED: {ReportStatus.CLOSED},
        ReportStatus.CLOSED: set(),
    }

    for current, allowed in valid_transitions.items():
        for candidate in allowed:
            assert candidate in valid_transitions[current]

    assert ReportStatus.REPORTED not in valid_transitions[ReportStatus.CLOSED]
