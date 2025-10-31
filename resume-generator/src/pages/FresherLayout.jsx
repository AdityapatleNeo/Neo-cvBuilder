
import { Page, Text, View, Image, Document, StyleSheet } from "@react-pdf/renderer";

export const FresherLayout = ({ data, layoutOptions, selectedLayout }) => {
  const modernBasicStyles = StyleSheet.create({
    page: {
      fontFamily: layoutOptions.font || "Helvetica",
      fontSize: layoutOptions.fontSize || 12,
      padding: 35,
      backgroundColor: "#f8f9fa",
      color: "#222",
    },
    header: {
      fontSize: 20,
      color: layoutOptions.color || "#007bff",
      marginBottom: 5,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    subHeader: {
      fontSize: 14,
      color: layoutOptions.color || "#007bff",
      marginTop: 10,
      marginBottom: 4,
      borderBottom: "1px solid #000",
      paddingBottom: 2,
    },
    section: { marginBottom: 10 },
    text: { fontSize: layoutOptions.fontSize, marginBottom: 2 },
    summary: { marginTop: 5, fontSize: 13, color: "#333" },
  });

  const elegantFormalStyles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 11,
      fontFamily: "Times-Roman",
      color: "#1a1a1a",
      backgroundColor: "#fff",
      lineHeight: 1.4,
    },
    header: {
      fontSize: 24,
      textAlign: "center",
      marginBottom: 8,
      color: "#800000",
      letterSpacing: 1.2,
    },
    subHeader: {
      fontSize: 14,
      color: "#800000",
      marginTop: 12,
      marginBottom: 4,
      textDecoration: "underline",
      fontWeight: "bold",
    },
    section: { marginBottom: 12 },
    text: { fontSize: 11, marginBottom: 2 },
    summary: { marginTop: 6, fontSize: 12, color: "#333" },
  });

  const experienceStyles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#fefefe",
    color: "#222",
    lineHeight: 1.5,
  },

  header: {
    fontSize: 24,
    textAlign: "center",
    color: "#1E3A8A", 
    fontWeight: "bold",
    marginBottom: 6,
    letterSpacing: 1,
  },

  contact: {
    textAlign: "center",
    fontSize: 10.5,
    color: "#4B5563",
    marginBottom: 10,
  },

  section: {
    marginTop: 14,
    marginBottom: 10,
    borderLeft: "3px solid #1E3A8A",
    paddingLeft: 8,
  },

  subHeader: {
    fontSize: 13.5,
    color: "#1E3A8A",
    marginBottom: 4,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  text: {
    fontSize: 10.5,
    marginBottom: 2.5,
    color: "#111",
  },

  bulletItem: {
    marginLeft: 10,
    fontSize: 10,
    marginBottom: 1,
    color: "#374151",
  },

  summary: {
    marginTop: 5,
    fontSize: 12,
    color: "#374151",
    textAlign: "justify",
  },

  divider: {
    height: 1,
    backgroundColor: "#D1D5DB",
    marginVertical: 6,
  },
});


  let styles =
    selectedLayout === "Basic"
      ? modernBasicStyles
      : selectedLayout === "Formal"
      ? elegantFormalStyles
      : experienceStyles;

  // console.log("Selected Layout:", selectedLayout);
// console.log(data)
  return (
    <Page size="A4" style={styles.page}>
       {data.personal.image && (
          <Image src={data.personal.image} style={{ width: 80, height: 80, marginBottom: 5 ,borderRadius:10, marginLeft:450 }} />
        )}
      <View style={styles.section}>
       
        <Text style={styles.header}>{data.personal.name}</Text>
        <Text style={styles.text}>
          {data.personal.email} | {data.personal.phone}
        </Text>
        <Text style={styles.text}>
          {data.personal.address}, {data.personal.city}, {data.personal.state} -{" "}
          {data.personal.pincode}
        </Text>
        <Text style={styles.summary}>Summary</Text>
        <Text style={styles.text}>{data.personal.introduction}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Education</Text>
        {data.education.map((ed, i) => (
          <View key={i} style={styles.text}>
            <Text>
              {ed.degree} - {ed.institution} ({ed.percentage})
            </Text>
          </View>
        ))} 
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Experience</Text>
        {data.experience.map((ex, i) => (
          <View key={i} style={styles.text}>
            <Text>
              {ex.position} at {ex.organization} ({ex.joiningDate} - {ex.leavingDate}) -{" "}
              {ex.location}
            </Text>
            <Text>CTC - {ex.ctc}</Text>
            {ex.technologies && <Text>Technologies: {ex.technologies}</Text>}
            {ex.description && <Text> Description: {ex.description} </Text>}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Projects</Text>
        {data.projects.map((p, i) => (
          <View key={i} style={styles.text}>
            <Text>{p.title}</Text>
            <Text>
              TeamSize {p.teamSize} - Duration {p.duration}
            </Text>
            <Text>TechStack - {p.technologies}</Text>
            <Text>{p.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Skills</Text>
        {data.skills.map((s, i) => (
          <View key={i} style={styles.text}>
            <Text>
              {s.name} - {s.level}%
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Social Profiles</Text>
        {data.socials.map((so, i) => (
          <Text key={i} style={styles.text}>
            {so.platform}: {so.link}
          </Text>
        ))}
      </View>
    </Page>
  );
};
