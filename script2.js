// Update range slider value display
document.getElementById('q1').addEventListener('input', function() {
    document.getElementById('q1Value').textContent = this.value;
});

// Function to calculate mental health score
function calculateMentalHealthScore(formData) {
    let score = 0;
    
    // Question 1: Mental health rating (1-10)
    score += parseInt(formData.get('q1'));
    
    // Question 2: Stress frequency (inverted scale as lower stress is better)
    score += (6 - parseInt(formData.get('q2'))) * 2;
    
    // Question 3: Social support (inverted scale)
    score += (5 - parseInt(formData.get('q3'))) * 2;
    
    // Question 4: Sleep quality
    score += parseInt(formData.get('q4')) * 2;
    
    // Question 6: Work/study impact
    const workImpact = parseInt(formData.get('q6'));
    score += (workImpact === 1) ? 10 : (workImpact === 2) ? 5 : 0;
    
    // Question 7: Resource awareness
    const resourceAwareness = parseInt(formData.get('q7'));
    score += (resourceAwareness === 1) ? 10 : (resourceAwareness === 2) ? 5 : 0;
    
    return score;
}

// Function to get recommendations based on score
function getRecommendations(score, formData) {
    let recommendations = [];
    
    if (score < 30) {
        recommendations.push("Consider speaking with a mental health professional.");
        recommendations.push("Prioritize self-care and stress management.");
    } else if (score < 45) {
        recommendations.push("Your mental health could benefit from additional support.");
        recommendations.push("Try incorporating regular exercise and mindfulness practices.");
    } else {
        recommendations.push("You're maintaining good mental health.");
        recommendations.push("Continue your positive practices and stay connected with your support system.");
    }
    
    // Add specific recommendations based on answers
    if (parseInt(formData.get('q3')) >= 3) {
        recommendations.push("Consider building a stronger support network or joining support groups.");
    }
    
    if (parseInt(formData.get('q4')) <= 2) {
        recommendations.push("Focus on improving sleep hygiene and establishing a regular sleep schedule.");
    }
    
    if (parseInt(formData.get('q7')) === 3) {
        recommendations.push("Research local mental health resources and helplines available in your area.");
    }
    
    return recommendations;
}

// Function to create visualization
function createVisualization(formData) {
    const ctx = document.createElement('canvas');
    ctx.id = 'surveyChart';
    document.getElementById('results').insertBefore(ctx, document.getElementById('downloadPdf'));
    
    const labels = [
        'Mental Health Rating',
        'Stress Level',
        'Social Support',
        'Sleep Quality',
        'Work/Study Impact'
    ];
    
    const data = [
        parseInt(formData.get('q1')),
        6 - parseInt(formData.get('q2')), // Inverted scale
        5 - parseInt(formData.get('q3')), // Inverted scale
        parseInt(formData.get('q4')),
        4 - parseInt(formData.get('q6')) // Normalized to 1-5 scale
    ];
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Your Mental Health Profile',
                data: data,
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
            }]
        },
        options: {
            elements: {
                line: { borderWidth: 3 }
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    pointLabels: { color: 'rgb(54, 162, 235)' },
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

// Function to generate PDF
function generatePDF(score, recommendations) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Mental Health Survey Results', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Overall Mental Health Score: ${score}/60`, 20, 40);
    
    doc.text('Recommendations:', 20, 60);
    let yPosition = 70;
    recommendations.forEach(recommendation => {
        const lines = doc.splitTextToSize(recommendation, 170);
        doc.text(lines, 20, yPosition);
        yPosition += 10 * lines.length;
    });
    
    // Add chart image
    const canvas = document.getElementById('surveyChart');
    if (canvas) {
        const chartImage = canvas.toDataURL('image/png');
        doc.addImage(chartImage, 'PNG', 20, yPosition, 170, 85);
    }
    
    doc.save('mental-health-survey-results.pdf');
}

// Main submission function
function submitSurvey() {
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    
    // Basic validation
    let isValid = true;
    for (let i = 1; i <= 7; i++) {
        if (i !== 5 && !formData.get(`q${i}`)) {
            isValid = false;
            break;
        }
    }
    
    if (!isValid) {
        alert('Please answer all required questions.');
        return;
    }
    
    // Calculate score and get recommendations
    const score = calculateMentalHealthScore(formData);
    const recommendations = getRecommendations(score, formData);
    
    // Display results
    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    // Create visualization
    createVisualization(formData);
    
    // Display recommendations
    const recommendationList = recommendations.join('\n• ');
    document.getElementById('recommendation').innerHTML = `
        <strong>Your Score: ${score}/60</strong><br><br>
        Recommendations:<br>• ${recommendationList}
    `;
    
    // Set up PDF download button
    document.getElementById('downloadPdf').addEventListener('click', () => {
        generatePDF(score, recommendations);
    });
}// Update range slider value display
document.getElementById('q1').addEventListener('input', function() {
    document.getElementById('q1Value').textContent = this.value;
});

// Function to calculate mental health score
function calculateMentalHealthScore(formData) {
    let score = 0;
    
    // Question 1: Mental health rating (1-10)
    score += parseInt(formData.get('q1'));
    
    // Question 2: Stress frequency (inverted scale as lower stress is better)
    score += (6 - parseInt(formData.get('q2'))) * 2;
    
    // Question 3: Social support (inverted scale)
    score += (5 - parseInt(formData.get('q3'))) * 2;
    
    // Question 4: Sleep quality
    score += parseInt(formData.get('q4')) * 2;
    
    // Question 6: Work/study impact
    const workImpact = parseInt(formData.get('q6'));
    score += (workImpact === 1) ? 10 : (workImpact === 2) ? 5 : 0;
    
    // Question 7: Resource awareness
    const resourceAwareness = parseInt(formData.get('q7'));
    score += (resourceAwareness === 1) ? 10 : (resourceAwareness === 2) ? 5 : 0;
    
    return score;
}

// Function to get recommendations based on score
function getRecommendations(score, formData) {
    let recommendations = [];
    
    if (score < 30) {
        recommendations.push("Consider speaking with a mental health professional.");
        recommendations.push("Prioritize self-care and stress management.");
    } else if (score < 45) {
        recommendations.push("Your mental health could benefit from additional support.");
        recommendations.push("Try incorporating regular exercise and mindfulness practices.");
    } else {
        recommendations.push("You're maintaining good mental health.");
        recommendations.push("Continue your positive practices and stay connected with your support system.");
    }
    
    // Add specific recommendations based on answers
    if (parseInt(formData.get('q3')) >= 3) {
        recommendations.push("Consider building a stronger support network or joining support groups.");
    }
    
    if (parseInt(formData.get('q4')) <= 2) {
        recommendations.push("Focus on improving sleep hygiene and establishing a regular sleep schedule.");
    }
    
    if (parseInt(formData.get('q7')) === 3) {
        recommendations.push("Research local mental health resources and helplines available in your area.");
    }
    
    return recommendations;
}

// Function to create visualization
function createVisualization(formData) {
    const ctx = document.createElement('canvas');
    ctx.id = 'surveyChart';
    document.getElementById('results').insertBefore(ctx, document.getElementById('downloadPdf'));
    
    const labels = [
        'Mental Health Rating',
        'Stress Level',
        'Social Support',
        'Sleep Quality',
        'Work/Study Impact'
    ];
    
    const data = [
        parseInt(formData.get('q1')),
        6 - parseInt(formData.get('q2')), // Inverted scale
        5 - parseInt(formData.get('q3')), // Inverted scale
        parseInt(formData.get('q4')),
        4 - parseInt(formData.get('q6')) // Normalized to 1-5 scale
    ];
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Your Mental Health Profile',
                data: data,
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
            }]
        },
        options: {
            elements: {
                line: { borderWidth: 3 }
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    pointLabels: { color: 'rgb(54, 162, 235)' },
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

// Function to generate PDF
function generatePDF(score, recommendations) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Mental Health Survey Results', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Overall Mental Health Score: ${score}/60`, 20, 40);
    
    doc.text('Recommendations:', 20, 60);
    let yPosition = 70;
    recommendations.forEach(recommendation => {
        const lines = doc.splitTextToSize(recommendation, 170);
        doc.text(lines, 20, yPosition);
        yPosition += 10 * lines.length;
    });
    
    // Add chart image
    const canvas = document.getElementById('surveyChart');
    if (canvas) {
        const chartImage = canvas.toDataURL('image/png');
        doc.addImage(chartImage, 'PNG', 20, yPosition, 170, 85);
    }
    
    doc.save('mental-health-survey-results.pdf');
}

// Main submission function
function submitSurvey() {
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    
    // Basic validation
    let isValid = true;
    for (let i = 1; i <= 7; i++) {
        if (i !== 5 && !formData.get(`q${i}`)) {
            isValid = false;
            break;
        }
    }
    
    if (!isValid) {
        alert('Please answer all required questions.');
        return;
    }
    
    // Calculate score and get recommendations
    const score = calculateMentalHealthScore(formData);
    const recommendations = getRecommendations(score, formData);
    
    // Display results
    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    // Create visualization
    createVisualization(formData);
    
    // Display recommendations
    const recommendationList = recommendations.join('\n• ');
    document.getElementById('recommendation').innerHTML = `
        <strong>Your Score: ${score}/60</strong><br><br>
        Recommendations:<br>• ${recommendationList}
    `;
    
    // Set up PDF download button
    document.getElementById('downloadPdf').addEventListener('click', () => {
        generatePDF(score, recommendations);
    });
}