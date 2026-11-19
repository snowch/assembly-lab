// Copyright © 2026 Christopher Snow
// Quick-reference snippets, each with safe memory and branch targets.
	.text
// Example 0: add
.global quick_reference_0
quick_reference_0:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
add w8, w9, w10
// End displayed snippet
.Lresume_0:
mov x30, x19
ret

// Example 1: add
.global quick_reference_1
quick_reference_1:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
add x8, x9, #4095
// End displayed snippet
.Lresume_1:
mov x30, x19
ret

// Example 2: add
.global quick_reference_2
quick_reference_2:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
add x8, x9, w10, sxtw #2
// End displayed snippet
.Lresume_2:
mov x30, x19
ret

// Example 3: adds
.global quick_reference_3
quick_reference_3:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
adds w8, w9, w10
// End displayed snippet
.Lresume_3:
mov x30, x19
ret

// Example 4: adds
.global quick_reference_4
quick_reference_4:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
adds x8, x9, #4095
// End displayed snippet
.Lresume_4:
mov x30, x19
ret

// Example 5: adds
.global quick_reference_5
quick_reference_5:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
adds x8, x9, w10, sxtw #2
// End displayed snippet
.Lresume_5:
mov x30, x19
ret

// Example 6: adr
.global quick_reference_6
quick_reference_6:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
adr x8, .Lqr_6_near
.Lqr_6_near:
nop
// End displayed snippet
.Lresume_6:
mov x30, x19
ret

// Example 7: adrp
.global quick_reference_7
quick_reference_7:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
adrp x8, .Lqr_7_near
add x8, x8, :lo12:.Lqr_7_near
.Lqr_7_near:
nop
// End displayed snippet
.Lresume_7:
mov x30, x19
ret

// Example 8: and
.global quick_reference_8
quick_reference_8:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
and w8, w9, w10
// End displayed snippet
.Lresume_8:
mov x30, x19
ret

// Example 9: ands
.global quick_reference_9
quick_reference_9:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ands w8, w9, w10
// End displayed snippet
.Lresume_9:
mov x30, x19
ret

// Example 10: asr
.global quick_reference_10
quick_reference_10:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
asr x8, x9, #5
// End displayed snippet
.Lresume_10:
mov x30, x19
ret

// Example 11: asr
.global quick_reference_11
quick_reference_11:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
asr w8, w9, w10
// End displayed snippet
.Lresume_11:
mov x30, x19
ret

// Example 12: b
.global quick_reference_12
quick_reference_12:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
b .Lqr_12_next
.Lqr_12_next:
nop
// End displayed snippet
.Lresume_12:
mov x30, x19
ret

// Example 13: b.cond
.global quick_reference_13
quick_reference_13:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
b.ne .Lqr_13_next
.Lqr_13_next:
nop
// End displayed snippet
.Lresume_13:
mov x30, x19
ret

// Example 14: bfi
.global quick_reference_14
quick_reference_14:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
bfi w8, w9, #4, #8
// End displayed snippet
.Lresume_14:
mov x30, x19
ret

// Example 15: bfxil
.global quick_reference_15
quick_reference_15:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
bfxil w8, w9, #4, #8
// End displayed snippet
.Lresume_15:
mov x30, x19
ret

// Example 16: bic
.global quick_reference_16
quick_reference_16:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
bic w8, w9, w10
// End displayed snippet
.Lresume_16:
mov x30, x19
ret

// Example 17: bics
.global quick_reference_17
quick_reference_17:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
bics w8, w9, w10
// End displayed snippet
.Lresume_17:
mov x30, x19
ret

// Example 18: bl
.global quick_reference_18
quick_reference_18:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
bl .Lqr_18_next
.Lqr_18_next:
nop
// End displayed snippet
.Lresume_18:
mov x30, x19
ret

// Example 19: blr
.global quick_reference_19
quick_reference_19:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
adr x9, .Lresume_19
// Displayed snippet
blr x9
// End displayed snippet
.Lresume_19:
mov x30, x19
ret

// Example 20: br
.global quick_reference_20
quick_reference_20:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
adr x9, .Lresume_20
// Displayed snippet
br x9
// End displayed snippet
.Lresume_20:
mov x30, x19
ret

// Example 21: cbnz
.global quick_reference_21
quick_reference_21:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
cbnz w8, .Lqr_21_next
.Lqr_21_next:
nop
// End displayed snippet
.Lresume_21:
mov x30, x19
ret

// Example 22: cbz
.global quick_reference_22
quick_reference_22:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
cbz w8, .Lqr_22_next
.Lqr_22_next:
nop
// End displayed snippet
.Lresume_22:
mov x30, x19
ret

// Example 23: cinc
.global quick_reference_23
quick_reference_23:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
cinc w8, w9, ne
// End displayed snippet
.Lresume_23:
mov x30, x19
ret

// Example 24: cmn
.global quick_reference_24
quick_reference_24:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
cmn x9, #24
// End displayed snippet
.Lresume_24:
mov x30, x19
ret

// Example 25: cmn
.global quick_reference_25
quick_reference_25:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
cmn w9, w10
// End displayed snippet
.Lresume_25:
mov x30, x19
ret

// Example 26: cmp
.global quick_reference_26
quick_reference_26:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
cmp x9, #24
// End displayed snippet
.Lresume_26:
mov x30, x19
ret

// Example 27: cmp
.global quick_reference_27
quick_reference_27:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
cmp w9, w10
// End displayed snippet
.Lresume_27:
mov x30, x19
ret

// Example 28: cneg
.global quick_reference_28
quick_reference_28:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
cneg w8, w9, ne
// End displayed snippet
.Lresume_28:
mov x30, x19
ret

// Example 29: csel
.global quick_reference_29
quick_reference_29:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
csel w8, w9, w10, ne
// End displayed snippet
.Lresume_29:
mov x30, x19
ret

// Example 30: cset
.global quick_reference_30
quick_reference_30:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
cset w8, ne
// End displayed snippet
.Lresume_30:
mov x30, x19
ret

// Example 31: csetm
.global quick_reference_31
quick_reference_31:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
csetm w8, ne
// End displayed snippet
.Lresume_31:
mov x30, x19
ret

// Example 32: csinc
.global quick_reference_32
quick_reference_32:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
csinc w8, w9, w10, ne
// End displayed snippet
.Lresume_32:
mov x30, x19
ret

// Example 33: csinv
.global quick_reference_33
quick_reference_33:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
csinv w8, w9, w10, ne
// End displayed snippet
.Lresume_33:
mov x30, x19
ret

// Example 34: csneg
.global quick_reference_34
quick_reference_34:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
csneg w8, w9, w10, ne
// End displayed snippet
.Lresume_34:
mov x30, x19
ret

// Example 35: eon
.global quick_reference_35
quick_reference_35:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
eon w8, w9, w10
// End displayed snippet
.Lresume_35:
mov x30, x19
ret

// Example 36: eor
.global quick_reference_36
quick_reference_36:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
eor w8, w9, w10
// End displayed snippet
.Lresume_36:
mov x30, x19
ret

// Example 37: ldp
.global quick_reference_37
quick_reference_37:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ldp x8, x10, [x9, #16]
// End displayed snippet
.Lresume_37:
mov x30, x19
ret

// Example 38: ldr
.global quick_reference_38
quick_reference_38:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ldr x8, [x9, #8]
// End displayed snippet
.Lresume_38:
mov x30, x19
ret

// Example 39: ldrb
.global quick_reference_39
quick_reference_39:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ldrb w8, [x9, #8]
// End displayed snippet
.Lresume_39:
mov x30, x19
ret

// Example 40: ldrh
.global quick_reference_40
quick_reference_40:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ldrh w8, [x9, #8]
// End displayed snippet
.Lresume_40:
mov x30, x19
ret

// Example 41: ldrsb
.global quick_reference_41
quick_reference_41:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ldrsb x8, [x9, #8]
// End displayed snippet
.Lresume_41:
mov x30, x19
ret

// Example 42: ldrsh
.global quick_reference_42
quick_reference_42:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ldrsh x8, [x9, #8]
// End displayed snippet
.Lresume_42:
mov x30, x19
ret

// Example 43: ldrsw
.global quick_reference_43
quick_reference_43:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ldrsw x8, [x9, #8]
// End displayed snippet
.Lresume_43:
mov x30, x19
ret

// Example 44: ldur
.global quick_reference_44
quick_reference_44:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ldur x8, [x9, #8]
// End displayed snippet
.Lresume_44:
mov x30, x19
ret

// Example 45: lsl
.global quick_reference_45
quick_reference_45:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
lsl x8, x9, #5
// End displayed snippet
.Lresume_45:
mov x30, x19
ret

// Example 46: lsl
.global quick_reference_46
quick_reference_46:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
lsl w8, w9, w10
// End displayed snippet
.Lresume_46:
mov x30, x19
ret

// Example 47: lsr
.global quick_reference_47
quick_reference_47:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
lsr x8, x9, #5
// End displayed snippet
.Lresume_47:
mov x30, x19
ret

// Example 48: lsr
.global quick_reference_48
quick_reference_48:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
lsr w8, w9, w10
// End displayed snippet
.Lresume_48:
mov x30, x19
ret

// Example 49: madd
.global quick_reference_49
quick_reference_49:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
madd x8, x9, x10, x11
// End displayed snippet
.Lresume_49:
mov x30, x19
ret

// Example 50: mneg
.global quick_reference_50
quick_reference_50:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
mneg w8, w9, w10
// End displayed snippet
.Lresume_50:
mov x30, x19
ret

// Example 51: mov
.global quick_reference_51
quick_reference_51:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
mov x8, x9
// End displayed snippet
.Lresume_51:
mov x30, x19
ret

// Example 52: mov
.global quick_reference_52
quick_reference_52:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
mov w8, #0x5100
// End displayed snippet
.Lresume_52:
mov x30, x19
ret

// Example 53: mov
.global quick_reference_53
quick_reference_53:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
mov x8, #-1
// End displayed snippet
.Lresume_53:
mov x30, x19
ret

// Example 54: movk
.global quick_reference_54
quick_reference_54:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
movk x8, #0x51, lsl #32
// End displayed snippet
.Lresume_54:
mov x30, x19
ret

// Example 55: movn
.global quick_reference_55
quick_reference_55:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
movn x8, #0x51, lsl #32
// End displayed snippet
.Lresume_55:
mov x30, x19
ret

// Example 56: movz
.global quick_reference_56
quick_reference_56:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
movz x8, #0x51, lsl #32
// End displayed snippet
.Lresume_56:
mov x30, x19
ret

// Example 57: msub
.global quick_reference_57
quick_reference_57:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
msub x8, x9, x10, x11
// End displayed snippet
.Lresume_57:
mov x30, x19
ret

// Example 58: mul
.global quick_reference_58
quick_reference_58:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
mul w8, w9, w10
// End displayed snippet
.Lresume_58:
mov x30, x19
ret

// Example 59: mvn
.global quick_reference_59
quick_reference_59:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
mvn x8, x9
// End displayed snippet
.Lresume_59:
mov x30, x19
ret

// Example 60: neg
.global quick_reference_60
quick_reference_60:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
neg w8, w9
// End displayed snippet
.Lresume_60:
mov x30, x19
ret

// Example 61: negs
.global quick_reference_61
quick_reference_61:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
negs w8, w9
// End displayed snippet
.Lresume_61:
mov x30, x19
ret

// Example 62: nop
.global quick_reference_62
quick_reference_62:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
nop
// End displayed snippet
.Lresume_62:
mov x30, x19
ret

// Example 63: orn
.global quick_reference_63
quick_reference_63:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
orn w8, w9, w10
// End displayed snippet
.Lresume_63:
mov x30, x19
ret

// Example 64: orr
.global quick_reference_64
quick_reference_64:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
orr w8, w9, w10
// End displayed snippet
.Lresume_64:
mov x30, x19
ret

// Example 65: ret
.global quick_reference_65
quick_reference_65:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
adr x30, .Lresume_65
// Displayed snippet
ret
// End displayed snippet
.Lresume_65:
mov x30, x19
ret

// Example 66: ret
.global quick_reference_66
quick_reference_66:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
adr x9, .Lresume_66
// Displayed snippet
ret x9
// End displayed snippet
.Lresume_66:
mov x30, x19
ret

// Example 67: ror
.global quick_reference_67
quick_reference_67:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ror x8, x9, #5
// End displayed snippet
.Lresume_67:
mov x30, x19
ret

// Example 68: ror
.global quick_reference_68
quick_reference_68:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ror w8, w9, w10
// End displayed snippet
.Lresume_68:
mov x30, x19
ret

// Example 69: sbfiz
.global quick_reference_69
quick_reference_69:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
sbfiz w8, w9, #4, #8
// End displayed snippet
.Lresume_69:
mov x30, x19
ret

// Example 70: sbfx
.global quick_reference_70
quick_reference_70:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
sbfx w8, w9, #4, #8
// End displayed snippet
.Lresume_70:
mov x30, x19
ret

// Example 71: sdiv
.global quick_reference_71
quick_reference_71:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
sdiv x8, x9, x10
// End displayed snippet
.Lresume_71:
mov x30, x19
ret

// Example 72: smaddl
.global quick_reference_72
quick_reference_72:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
smaddl x8, w9, w10, x11
// End displayed snippet
.Lresume_72:
mov x30, x19
ret

// Example 73: smulh
.global quick_reference_73
quick_reference_73:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
smulh x8, x9, x10
// End displayed snippet
.Lresume_73:
mov x30, x19
ret

// Example 74: smull
.global quick_reference_74
quick_reference_74:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
smull x8, w9, w10
// End displayed snippet
.Lresume_74:
mov x30, x19
ret

// Example 75: stp
.global quick_reference_75
quick_reference_75:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
stp x8, x10, [x9, #16]
// End displayed snippet
.Lresume_75:
mov x30, x19
ret

// Example 76: str
.global quick_reference_76
quick_reference_76:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
str x8, [x9, #8]
// End displayed snippet
.Lresume_76:
mov x30, x19
ret

// Example 77: strb
.global quick_reference_77
quick_reference_77:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
strb w8, [x9, #8]
// End displayed snippet
.Lresume_77:
mov x30, x19
ret

// Example 78: strh
.global quick_reference_78
quick_reference_78:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
strh w8, [x9, #8]
// End displayed snippet
.Lresume_78:
mov x30, x19
ret

// Example 79: stur
.global quick_reference_79
quick_reference_79:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
stur x8, [x9, #8]
// End displayed snippet
.Lresume_79:
mov x30, x19
ret

// Example 80: sub
.global quick_reference_80
quick_reference_80:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
sub w8, w9, w10
// End displayed snippet
.Lresume_80:
mov x30, x19
ret

// Example 81: sub
.global quick_reference_81
quick_reference_81:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
sub x8, x9, #4095
// End displayed snippet
.Lresume_81:
mov x30, x19
ret

// Example 82: sub
.global quick_reference_82
quick_reference_82:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
sub x8, x9, w10, sxtw #2
// End displayed snippet
.Lresume_82:
mov x30, x19
ret

// Example 83: subs
.global quick_reference_83
quick_reference_83:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
subs w8, w9, w10
// End displayed snippet
.Lresume_83:
mov x30, x19
ret

// Example 84: subs
.global quick_reference_84
quick_reference_84:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
subs x8, x9, #4095
// End displayed snippet
.Lresume_84:
mov x30, x19
ret

// Example 85: subs
.global quick_reference_85
quick_reference_85:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
subs x8, x9, w10, sxtw #2
// End displayed snippet
.Lresume_85:
mov x30, x19
ret

// Example 86: sxtb
.global quick_reference_86
quick_reference_86:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
sxtb w8, w9
// End displayed snippet
.Lresume_86:
mov x30, x19
ret

// Example 87: sxth
.global quick_reference_87
quick_reference_87:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
sxth w8, w9
// End displayed snippet
.Lresume_87:
mov x30, x19
ret

// Example 88: sxtw
.global quick_reference_88
quick_reference_88:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
sxtw x8, w9
// End displayed snippet
.Lresume_88:
mov x30, x19
ret

// Example 89: tbnz
.global quick_reference_89
quick_reference_89:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
tbnz x8, #9, .Lqr_89_next
.Lqr_89_next:
nop
// End displayed snippet
.Lresume_89:
mov x30, x19
ret

// Example 90: tbz
.global quick_reference_90
quick_reference_90:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
tbz x8, #9, .Lqr_90_next
.Lqr_90_next:
nop
// End displayed snippet
.Lresume_90:
mov x30, x19
ret

// Example 91: tst
.global quick_reference_91
quick_reference_91:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
tst w9, #0xff
// End displayed snippet
.Lresume_91:
mov x30, x19
ret

// Example 92: ubfiz
.global quick_reference_92
quick_reference_92:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ubfiz w8, w9, #4, #8
// End displayed snippet
.Lresume_92:
mov x30, x19
ret

// Example 93: ubfx
.global quick_reference_93
quick_reference_93:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
ubfx w8, w9, #4, #8
// End displayed snippet
.Lresume_93:
mov x30, x19
ret

// Example 94: udiv
.global quick_reference_94
quick_reference_94:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
udiv x8, x9, x10
// End displayed snippet
.Lresume_94:
mov x30, x19
ret

// Example 95: umaddl
.global quick_reference_95
quick_reference_95:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
umaddl x8, w9, w10, x11
// End displayed snippet
.Lresume_95:
mov x30, x19
ret

// Example 96: umulh
.global quick_reference_96
quick_reference_96:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
umulh x8, x9, x10
// End displayed snippet
.Lresume_96:
mov x30, x19
ret

// Example 97: umull
.global quick_reference_97
quick_reference_97:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
umull x8, w9, w10
// End displayed snippet
.Lresume_97:
mov x30, x19
ret

// Example 98: uxtb
.global quick_reference_98
quick_reference_98:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
uxtb w8, w9
// End displayed snippet
.Lresume_98:
mov x30, x19
ret

// Example 99: uxth
.global quick_reference_99
quick_reference_99:
mov x19, x30
adr x9, quick_reference_data
mov w8, #0x51
mov w10, #3
mov w11, #9
// Displayed snippet
uxth w8, w9
// End displayed snippet
.Lresume_99:
mov x30, x19
ret

.data
.balign 8
quick_reference_data:
.quad 0x1122334455667788, 0xffeeddccbbaa9988, 0, 0
.zero 64
