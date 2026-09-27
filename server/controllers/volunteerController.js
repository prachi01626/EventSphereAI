// @desc    AI Volunteer Headcount Allocation across 5 core departments
// @route   POST /api/volunteers/allocate
// @access  Public or Private (Organizer)
const allocateVolunteers = async (req, res, next) => {
  try {
    const { totalParticipants = 500, totalVolunteers = 30, departmentOverrides } = req.body;

    const participants = Math.max(1, Number(totalParticipants));
    const volunteers = Math.max(1, Number(totalVolunteers));

    // Standard baseline distribution ratios
    const baseRatios = {
      registration: 0.30,      // 30%
      crowdManagement: 0.25,   // 25%
      technical: 0.20,         // 20%
      hospitality: 0.15,       // 15%
      media: 0.10,             // 10%
    };

    // Calculate baseline counts (integer rounded)
    let registrationCount = Math.round(volunteers * baseRatios.registration);
    let crowdCount = Math.round(volunteers * baseRatios.crowdManagement);
    let technicalCount = Math.round(volunteers * baseRatios.technical);
    let hospitalityCount = Math.round(volunteers * baseRatios.hospitality);
    let mediaCount = volunteers - (registrationCount + crowdCount + technicalCount + hospitalityCount);

    if (mediaCount < 1 && volunteers >= 5) {
      mediaCount = 1;
      crowdCount = Math.max(1, crowdCount - 1);
    }

    const baseline = [
      {
        department: 'Registration & Check-in',
        key: 'registration',
        count: registrationCount,
        percentage: 30,
        responsibilities: 'Dynamic QR scanning, fast-track attendee check-in, badge distribution, query resolution.',
        recommendedRatio: '1 volunteer per 35 attendees per entry gate',
      },
      {
        department: 'Crowd Management & Flow',
        key: 'crowdManagement',
        count: crowdCount,
        percentage: 25,
        responsibilities: 'Main auditorium flow, queue management, emergency access corridor monitoring.',
        recommendedRatio: '1 volunteer per 50 attendees',
      },
      {
        department: 'Technical & AV Production',
        key: 'technical',
        count: technicalCount,
        percentage: 20,
        responsibilities: 'Speaker mic checks, livestream telemetry, Wi-Fi infrastructure, backstage cueing.',
        recommendedRatio: '1 volunteer per stage / lab zone',
      },
      {
        department: 'Hospitality & VIP Concierge',
        key: 'hospitality',
        count: hospitalityCount,
        percentage: 15,
        responsibilities: 'Speaker hospitality, catering logistics, VIP lounge coordination, special assistance.',
        recommendedRatio: '1 volunteer per 75 attendees',
      },
      {
        department: 'Media & Social Broadcast',
        key: 'media',
        count: mediaCount,
        percentage: 10,
        responsibilities: 'Live micro-updates, photography, backstage interviews, social buzz broadcasting.',
        recommendedRatio: '1 volunteer per media workstation',
      },
    ];

    // Compute metrics
    const participantToVolunteerRatio = (participants / volunteers).toFixed(1);
    let riskLevel = 'Optimal';
    let recommendations = [];

    if (participants / volunteers > 25) {
      riskLevel = 'High Staffing Pressure';
      recommendations.push('Volunteer-to-participant ratio exceeds 1:25. Consider recruiting at least 10 additional volunteers or utilizing multi-line self-check-in kiosks.');
    } else if (participants / volunteers > 15) {
      riskLevel = 'Moderate Load';
      recommendations.push('Staffing is stable. Assign top experienced volunteers to Registration & Crowd Management during peak check-in morning hours (08:30 - 10:00 AM).');
    } else {
      riskLevel = 'Optimal & High Touch';
      recommendations.push('Excellent volunteer coverage. Hospitality and media engagement can be heavily prioritized for premium attendee experience.');
    }

    // Dynamic shift advice
    const shiftSchedule = [
      { shift: 'Shift 1: Morning Ingress', time: '08:00 AM - 12:00 PM', focus: 'Heavy Registration (40%) & Crowd Management (30%)' },
      { shift: 'Shift 2: Mid-Day Sessions', time: '12:00 PM - 04:00 PM', focus: 'Technical Support (35%) & Hospitality Catering (30%)' },
      { shift: 'Shift 3: Evening Egress & Mixer', time: '04:00 PM - 07:30 PM', focus: 'Media Broadcast (25%) & Stage Logistics (35%)' },
    ];

    res.status(200).json({
      success: true,
      totalParticipants: participants,
      totalVolunteers: volunteers,
      participantToVolunteerRatio: `1:${participantToVolunteerRatio}`,
      riskLevel,
      recommendations,
      departments: baseline,
      shiftSchedule,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  allocateVolunteers,
};
