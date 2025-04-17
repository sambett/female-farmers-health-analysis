import React, { useState } from 'react';

// Define inline styles for consistency
const styles = {
  container: { padding: '24px', backgroundColor: '#f0f7ff', borderRadius: '12px', maxWidth: '1200px', margin: '0 auto' },
  header: { textAlign: 'center' as const, marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1a365d', marginBottom: '12px' },
  subtitle: { fontSize: '16px', color: '#4a5568', maxWidth: '800px', margin: '0 auto' },
  insightsList: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  insightCard: { backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s ease' },
  insightHeader: { padding: '16px', display: 'flex', alignItems: 'center', cursor: 'pointer' },
  iconBox: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EBF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' },
  insightTitle: { fontSize: '20px', fontWeight: 'bold', color: '#2D3748', marginBottom: '4px' },
  insightTagline: { fontSize: '16px', color: '#4A5568', fontStyle: 'italic' },
  insightContent: { padding: '0 16px 16px', borderTop: '1px solid #E2E8F0' },
  insightText: { fontSize: '15px', color: '#4A5568', lineHeight: '1.6', marginBottom: '16px' },
  evidenceBox: { backgroundColor: '#EBF8FF', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  implicationBox: { backgroundColor: '#F0FFF4', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  questionBox: { backgroundColor: '#FAF5FF', padding: '12px', borderRadius: '8px' },
  boxTitle: { fontWeight: 'bold', marginBottom: '4px' },
  takeawayBox: { marginTop: '32px', padding: '16px', backgroundColor: '#FFFBEB', borderRadius: '8px', border: '1px solid #F6E05E' },
  takeawayTitle: { fontWeight: 'bold', color: '#744210', marginBottom: '8px', display: 'flex', alignItems: 'center' },
  emphasis: { fontWeight: 'bold' }
};

const KeyInsights: React.FC = () => {
  // State to track which insight is expanded
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  
  // Toggle insight expansion
  const toggleInsight = (index: number) => {
    if (expandedInsight === index) {
      setExpandedInsight(null);
    } else {
      setExpandedInsight(index);
    }
  };

  // Arrow icon as a simple SVG
  const ArrowIcon = ({ expanded }: { expanded: boolean }) => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease'
      }}
    >
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Icons for insights as simple SVG elements
  const ThunderboltIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 3V10H20L11 21V14H4L13 3Z" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const FireIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L7 8L5 16L12 22L19 16L17 8L12 2Z" fill="#EF4444" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ExperimentIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3L9 8M15 3L15 8M7 13H17M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const LightbulbIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const MapIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Insights data
  const insightsData = [
    {
      icon: <ThunderboltIcon />,
      title: "The Grandmother Paradox",
      tagline: "Experience doesn't lead to better protection—quite the opposite!",
      description: "Contrary to what we'd expect, women with more agricultural experience (20+ years) show 20% lower protection behavior than newer workers. Our analysis revealed a negative correlation between years of experience and protection scores (F=0.40, p=0.807).",
      evidence: "Older workers in Cluster 2 (with 42.5 years experience) showed the lowest protection scores—20% below average, despite facing the highest health risks with cardiovascular indicators 91.4% above average.",
      implication: "Traditional knowledge doesn't translate to better safety practices. We need to specifically target experienced workers with tailored education rather than assume they'll naturally adopt better practices over time.",
      questionAnswered: "Why don't protection behaviors improve with experience in agriculture?"
    },
    {
      icon: <FireIcon />,
      title: "The Children Effect",
      tagline: "Family size is the strongest statistical predictor of occupational risk!",
      description: "In all our demographic variables, can you guess which one most strongly predicts protection behaviors? Age? Education? Experience? None of those—it's the number of children a woman has (p=0.048, F=2.76).",
      evidence: "Enhanced Cluster 3 (women with 3.1 children on average) showed 6.1% below average protection scores despite being in their prime working years (43.9 years) with decent socioeconomic status.",
      implication: "Competing family responsibilities create a hidden 'time poverty' that impacts safety practices. Interventions must account for family burdens and offer practical solutions that work within existing time constraints.",
      questionAnswered: "How do family responsibilities affect occupational safety practices?"
    },
    {
      icon: <ExperimentIcon />,
      title: "The Invisible vs. Visible Risk Perception",
      tagline: "Women protect against what they can see, not what will harm them most!",
      description: "We discovered a fascinating protection hierarchy that defies risk logic: head protection > extremities > respiratory, despite respiratory risks being most severe from chemical exposure.",
      evidence: "70-80% of women consistently use head coverings, while 70% never use respiratory protection despite 63% being exposed to harmful pesticides. The reason? Immediate discomfort (sun, cuts) drives protection more than invisible chemical risks.",
      implication: "Risk perception is visual and immediate, not logical or long-term. Effective interventions need to make invisible risks 'feelable' through education and demonstration rather than just explaining dangers.",
      questionAnswered: "Why do agricultural workers prioritize certain types of protection over others?"
    },
    {
      icon: <LightbulbIcon />,
      title: "The Husband Influence",
      tagline: "The strongest protection predictor might be who you married!",
      description: "Our analysis revealed an unexpected pattern: women whose husbands work in agriculture show dramatically better protection behaviors—100% better protective equipment usage than women married to non-agricultural workers.",
      evidence: "In our MCA analysis, women in Cluster 5 (100% married to 'agriculteur') showed comprehensive protection despite similar exposures as other clusters. This pattern persisted even when controlling for education and region.",
      implication: "Knowledge transfer happens at home, not just through formal channels. Interventions should leverage these household dynamics by engaging husbands in agricultural families and creating peer education between households.",
      questionAnswered: "What unexpected social factors influence protection behavior in female farmers?"
    },
    {
      icon: <MapIcon />,
      title: "The Regional Culture Effect",
      tagline: "Your protection behaviors depend heavily on where you farm!",
      description: "Regional differences in protection behavior persist even after controlling for education, income, and age. We found distinct 'regional agricultural cultures' with characteristic patterns.",
      evidence: "Monastir (65% of sample) showed 'polarized' protection—either very good or very poor. Sfax (25%) showed consistently low protection (80-100% in high-risk Clusters 1, 3, 5). Mahdia (10%) prioritized only head protection with 0% mask usage despite 80% pesticide exposure.",
      implication: "One-size-fits-all national interventions will fail. Each region needs tailored approaches that work within existing cultural frameworks and address specific regional risk patterns.",
      questionAnswered: "How do geographical factors influence occupational health practices among female farmers?"
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Surprising Discoveries</h1>
        <p style={styles.subtitle}>
          Our data analysis revealed unexpected patterns that challenge conventional wisdom 
          about female farmers' occupational health. Here are five key insights we would 
          never have discovered without advanced multivariate analysis.
        </p>
      </div>

      <div style={styles.insightsList}>
        {insightsData.map((insight, index) => (
          <div 
            key={index}
            style={{
              ...styles.insightCard,
              transform: expandedInsight === index ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <div 
              style={styles.insightHeader}
              onClick={() => toggleInsight(index)}
            >
              <div style={styles.iconBox}>
                {insight.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={styles.insightTitle}>{insight.title}</h3>
                <p style={styles.insightTagline}>{insight.tagline}</p>
              </div>
              <ArrowIcon expanded={expandedInsight === index} />
            </div>
            
            {expandedInsight === index && (
              <div style={styles.insightContent}>
                <p style={styles.insightText}>{insight.description}</p>
                
                <div style={styles.evidenceBox}>
                  <h4 style={styles.boxTitle}>The Evidence:</h4>
                  <p>{insight.evidence}</p>
                </div>
                
                <div style={styles.implicationBox}>
                  <h4 style={styles.boxTitle}>Why It Matters:</h4>
                  <p>{insight.implication}</p>
                </div>
                
                <div style={styles.questionBox}>
                  <h4 style={styles.boxTitle}>Question Answered:</h4>
                  <p style={{ fontStyle: 'italic' }}>"{insight.questionAnswered}"</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={styles.takeawayBox}>
        <h3 style={styles.takeawayTitle}>
          <span style={{ marginRight: '8px' }}>💡</span> 
          Key Takeaway
        </h3>
        <p>
          Our analysis revealed that protecting female agricultural workers requires a 
          <span style={styles.emphasis}> multidimensional approach</span> that goes far beyond just providing equipment. 
          We must account for <span style={styles.emphasis}> family dynamics</span>, <span style={styles.emphasis}> regional cultures</span>, 
          <span style={styles.emphasis}> knowledge transfer</span>, and <span style={styles.emphasis}> perceptual biases</span> to 
          create truly effective interventions.
        </p>
      </div>
    </div>
  );
};

export default KeyInsights;