	.text
	.global f
f:
	mov w27, 0
	cset w2, eq
	cset w3, ne
	cset w4, cs
	cset w5, cc
	cset w6, mi
	cset w7, pl
	cset w8, vs
	cset w9, vc
	cset w10, hi
	cset w11, ls
	cset w12, ge
	cset w13, lt
	cset w14, gt
	cset w15, le
	cset w16, hs
	cset w17, lo
	csel x20, x0, x1, hi
	csinc x21, x0, x1, ge
	csinv x22, x0, x1, vs
	csneg x23, x0, x1, mi
	csetm w24, lt
	cinc w25, w0, le
	cneg x26, x1, ne
	b.eq .Lt0
	orr w27, w27, 1
.Lt0:
	b.ne .Lt1
	orr w27, w27, 2
.Lt1:
	b.cs .Lt2
	orr w27, w27, 4
.Lt2:
	b.cc .Lt3
	orr w27, w27, 8
.Lt3:
	b.mi .Lt4
	orr w27, w27, 16
.Lt4:
	b.pl .Lt5
	orr w27, w27, 32
.Lt5:
	b.vs .Lt6
	orr w27, w27, 64
.Lt6:
	b.vc .Lt7
	orr w27, w27, 128
.Lt7:
	b.hi .Lt8
	orr w27, w27, 256
.Lt8:
	b.ls .Lt9
	orr w27, w27, 512
.Lt9:
	b.ge .Lt10
	orr w27, w27, 1024
.Lt10:
	b.lt .Lt11
	orr w27, w27, 2048
.Lt11:
	b.gt .Lt12
	orr w27, w27, 4096
.Lt12:
	b.le .Lt13
	orr w27, w27, 8192
.Lt13:
	csel x28, x0, x1, al
	ret
