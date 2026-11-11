"""Phan tich ket qua usability (Phase 3): SUS, bang task, pain point theo muc do.

Dau vao (dien sau moi buoi, KHONG dien du lieu gia):
  usability/data/sus.csv         participant,q1..q10            (thang 1-5)
  usability/data/tasks.csv       participant,task,result,time_s,errors,seq
                                 result: HT | HT-ho-tro | That-bai
  usability/data/issues.csv      issue_id,description,participants,severity,type,bug
                                 participants: P1;P3;P5   severity: 1-4   type: he-thong | don-le (tu tinh neu de trong)
Dau ra: in Markdown ra stdout, hoac ghi vao file neu co tham so:
  python tools/analyze_usability.py usability/analysis.md
"""
import csv, os, statistics as st, sys
from collections import defaultdict

BASE = os.environ.get('USABILITY_DATA') or os.path.join(os.path.dirname(__file__), '..', 'usability', 'data')
TASKS = ['T1', 'T2', 'T3', 'T4', 'T5']
SEV = {4: 'Blocker', 3: 'Major', 2: 'Minor', 1: 'Cosmetic'}


def rows(name):
    p = os.path.join(BASE, name)
    if not os.path.exists(p):
        return []
    return [r for r in csv.DictReader(open(p, encoding='utf-8-sig')) if any((v or '').strip() for v in r.values())]


def sus_score(r):
    a = [int(r[f'q{i}']) for i in range(1, 11)]
    assert all(1 <= x <= 5 for x in a), r
    return sum((x - 1) if i % 2 == 0 else (5 - x) for i, x in enumerate(a)) * 2.5


def grade(s):
    # thang Bangor et al. (2009) / Sauro-Lewis
    return 'Tốt (≥ 80.3)' if s >= 80.3 else 'Trên trung bình (68–80)' if s >= 68 else 'Dưới trung bình (51–68)' if s >= 51 else 'Kém (< 51)'


def main():
    L = []
    sus = rows('sus.csv')
    if sus:
        sc = {r['participant']: sus_score(r) for r in sus}
        v = list(sc.values())
        L += ['## SUS', '', '| P | ' + ' | '.join(f'Q{i}' for i in range(1, 11)) + ' | SUS |', '|' + '---|' * 12]
        for r in sus:
            L.append(f"| {r['participant']} | " + ' | '.join(r[f'q{i}'] for i in range(1, 11)) + f" | {sc[r['participant']]:.1f} |")
        sd = st.stdev(v) if len(v) > 1 else 0
        L += ['', f'- n = {len(v)} · **trung bình {st.mean(v):.1f}** · trung vị {st.median(v):.1f} · độ lệch chuẩn {sd:.1f} · min {min(v):.1f} · max {max(v):.1f}',
              f'- Xếp loại theo trung bình: **{grade(st.mean(v))}** (mốc trung bình ngành ≈ 68)', '']
        if len(v) > 1:
            T95 = {2: 12.706, 3: 4.303, 4: 3.182, 5: 2.776, 6: 2.571, 7: 2.447, 8: 2.365, 9: 2.306, 10: 2.262}
            ci = T95.get(len(v), 1.96) * sd / len(v) ** 0.5
            L += [f'- Khoảng tin cậy 95% (t, n={len(v)}): {st.mean(v) - ci:.1f} – {st.mean(v) + ci:.1f}', '']

    tasks = rows('tasks.csv')
    if tasks:
        g = defaultdict(list)
        for r in tasks:
            g[r['task']].append(r)
        L += ['## Kết quả theo task', '', '| Task | n | Hoàn thành | Có hỗ trợ | Thất bại | Tỷ lệ HT (không hỗ trợ) | TG trung bình (s) | Lỗi TB | SEQ TB |', '|---|---|---|---|---|---|---|---|---|']
        for t in TASKS:
            rs = g.get(t, [])
            if not rs:
                continue
            c = defaultdict(int)
            for r in rs:
                c[r['result']] += 1
            tm = [float(r['time_s']) for r in rs if r['time_s']]
            er = [float(r['errors']) for r in rs if r['errors']]
            sq = [float(r['seq']) for r in rs if r['seq']]
            f = lambda x: f'{st.mean(x):.1f}' if x else '—'
            L.append(f"| {t} | {len(rs)} | {c['HT']} | {c['HT-ho-tro']} | {c['That-bai']} | {100 * c['HT'] / len(rs):.0f}% | {f(tm)} | {f(er)} | {f(sq)} |")
        L.append('')

    iss = rows('issues.csv')
    if iss:
        L += ['## Pain point theo mức độ', '', '| ID | Mô tả | Người gặp | Số người | Phân loại | Mức | Bug |', '|---|---|---|---|---|---|---|']
        for r in sorted(iss, key=lambda r: (-int(r['severity']), -len(r['participants'].split(';')))):
            ps = [p for p in r['participants'].split(';') if p.strip()]
            typ = r.get('type') or ('Vấn đề hệ thống' if len(ps) >= 3 else 'Lỗi đơn lẻ')
            L.append(f"| {r['issue_id']} | {r['description']} | {', '.join(ps)} | {len(ps)}/7 | {typ} | {r['severity']} – {SEV[int(r['severity'])]} | {r.get('bug', '')} |")
        L.append('')

    out = '\n'.join(L) or '_Chưa có dữ liệu trong usability/data/._'
    if len(sys.argv) > 1:
        open(sys.argv[1], 'w', encoding='utf-8').write('# Phân tích usability (sinh tự động)\n\n' + out)
        print('->', sys.argv[1])
    else:
        print(out)


if __name__ == '__main__':
    main()
