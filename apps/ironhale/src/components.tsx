import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from './theme';

export { ExerciseDemo } from './ExerciseAnimation';

export function Choice({label,selected,onPress,detail}:{label:string;selected:boolean;onPress:()=>void;detail?:string}){const choose=()=>{void Haptics.selectionAsync().catch(()=>{});onPress();};return <TouchableOpacity activeOpacity={0.82} accessibilityRole="button" accessibilityState={{selected}} style={[s.choice,selected&&s.choiceSelected]} onPress={choose}><View style={[s.check,selected&&s.checkSelected]}>{selected?<Ionicons name="checkmark" color="#fff" size={15}/>:null}</View><View style={{flex:1}}><Text style={[s.choiceLabel,selected&&s.choiceLabelSelected]}>{label}</Text>{detail?<Text style={s.detail}>{detail}</Text>:null}</View><Ionicons name={selected?'checkmark-circle':'chevron-forward'} size={selected?19:17} color={selected?colors.green:'#AEB6B0'}/></TouchableOpacity>}

export function Pill({children,tone='green'}:{children:React.ReactNode;tone?:'green'|'orange'|'gray'}){return <View style={[s.pill,tone==='orange'&&s.pillOrange,tone==='gray'&&s.pillGray]}><Text style={s.pillText}>{children}</Text></View>}

export function BrandMark({size=46}:{size?:number}){return <View style={[s.brand,{width:size,height:size}]}><Image source={require('../assets/adaptive-icon.png')} style={{width:size*1.12,height:size*1.12}} resizeMode="contain"/></View>}

const s=StyleSheet.create({choice:{width:'100%',minHeight:64,borderRadius:16,borderWidth:1.5,borderColor:colors.line,backgroundColor:colors.surface,padding:15,flexDirection:'row',alignItems:'center',gap:12},choiceSelected:{borderColor:colors.green,backgroundColor:'#EEF6F0'},check:{width:26,height:26,borderRadius:13,borderWidth:1.5,borderColor:'#AEB6B0',alignItems:'center',justifyContent:'center'},checkSelected:{backgroundColor:colors.green,borderColor:colors.green},choiceLabel:{fontSize:17,fontWeight:'700',color:colors.ink},choiceLabelSelected:{color:colors.green},detail:{fontSize:15,lineHeight:20,color:colors.muted,marginTop:3},brand:{backgroundColor:colors.green,borderRadius:14,alignItems:'center',justifyContent:'center',overflow:'hidden'},pill:{alignSelf:'flex-start',backgroundColor:colors.soft,borderRadius:999,paddingHorizontal:11,paddingVertical:7},pillOrange:{backgroundColor:'#FCEBDD'},pillGray:{backgroundColor:'#ECEDEA'},pillText:{color:colors.ink,fontSize:13,fontWeight:'800'}});
