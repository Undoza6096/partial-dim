el = x => document.getElementById(x)
el_class = x => document.getElementsByClassName(x)
getEl = el

/* Credits to MrRedShark77. */
E = x => new Decimal(x)
E_BI = x => new Decimal_BI(x)
INF = Number.MAX_VALUE

m_pow2 = x => Math.pow(2, x)
m_pow10 = x => Math.pow(10, x)
pow2 = x => Decimal.pow(2, x)
pow10 = x => Decimal.pow(10, x)
pow_inf = x => Decimal.pow(INF, x)
d_pow10 = x => pow10(m_pow10(x))