import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY, radius } from "@/constants/theme";
import { verticalScale, scale } from "@/utils/styling";
import Header from "@/components/header";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { BarChart } from "react-native-gifted-charts";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/authContext";
import { fetchWeeklyStats } from "../../services/transactionService";

const Statistics = () => {
  const {user} = useAuth()
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([
    {
      value: 40,
      label: "Mon",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
      // topLabelComponent: () => {
      //   <Typo size={30} style={{marginBottom: 4}} fontWeight={"bold"}>$0</Typo>
      // }
    },
    {
      value: 20,
      frontColor: colors.rose,
    },
    {
      value: 50,
      label: "Tue",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 20,
      frontColor: colors.rose,
    },
    {
      value: 35,
      label: "Wed",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 25,
      frontColor: colors.rose,
    },
    {
      value: 60,
      label: "Thu",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 30,
      frontColor: colors.rose,
    },
    {
      value: 45,
      label: "Fri",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 28,
      frontColor: colors.rose,
    },
    {
      value: 55,
      label: "Sat",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 22,
      frontColor: colors.rose,
    },
    {
      value: 48,
      label: "Sun",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 26,
      frontColor: colors.rose,
    },
  ]);
  const [chartLoading, setChartLoading] = useState(false);


  useEffect(() => {
    if (activeIndex === 0) {
      getWeeklyStats()
    }
    if (activeIndex === 1) {
      getMonthlyStats();
    }
    if (activeIndex === 2) {
      getYearlyStats();
    }
  }, [activeIndex])

  const getWeeklyStats = async () => {
    // get weekly stats
    setChartLoading(true)
    let res = await fetchWeeklyStats(user.uid)
    setChartLoading(false)
    if (res.success === true) {
      setChartData(res?.data?.stats)
    } else {
      Alert.alert("Error", res.msg)
    }
  }

  const getMonthlyStats = async () => {
    // get monthly stats
  };
  const getYearlyStats = async () => {
    // get yearly stats
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header style={styles.header} title="Statistics"></Header>
        </View>
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            activeFontStyle={styles.segementFontStyle}
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segementFontStyle, color: colors.white }}
          ></SegmentedControl>
          {/* charh container */}
          <View style={styles.chartContainer}>
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={scale(12)}
                spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)} // to increase space of bar chart for yearly and monthly
                roundedTop
                roundedBottom
                hideRules
                yAxisLabelPrefix="$"
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={
                  [1, 2].includes(activeIndex) ? scale(38) : scale(35)
                }
                yAxisTextStyle={{ color: colors.neutral350 }}
                xAxisLabelTextStyle={{
                  color: colors.neutral350,
                  fontSize: verticalScale(12),
                }}
                noOfSections={3}
                minHeight={5}
                isAnimated={true}
                animationDuration={1000}
                // maxValue={100}
              />
            ) : (
              <View style={styles.noChart} />
            )}
            {chartLoading && (
              <View style={styles.chartLoadingContainer}>
                <Loading color={colors.white} />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0, 0.6)",
  },
  header: {},
  noChart: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: verticalScale(210),
  },

  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",
  },
  segmentStyle: {
    height: scale(37),
  },
  segementFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
});
