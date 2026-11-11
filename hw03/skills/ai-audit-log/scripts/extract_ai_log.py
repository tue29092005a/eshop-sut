"""Trich nhat ky AI tu transcript Claude Code (.jsonl) ra Markdown cho AI Audit Report.

Moi luot: cong cu + model, thoi diem (gio VN), prompt nguyen van cua nguoi dung,
output van ban cua AI (nguyen van) va danh sach cong cu AI da goi.

Cach dung:
  python extract_ai_log.py <thu_muc_transcript> <file_ra.md>
  vd: python tools/extract_ai_log.py "%USERPROFILE%/.claude/projects/d--CNTT-2026-2027-KTPM-hw03" eshop-sut/hw03/ai_log/ai_log_full.md
"""
import json, glob, os, re, sys, collections
from datetime import datetime, timedelta, timezone

VN = timezone(timedelta(hours=7))
TAG = re.compile(r'<(system-reminder|ide_selection|ide_opened_file|command-[a-z-]+|local-command-[a-z-]+)>.*?</\1>', re.S)


def text_of(content):
    if isinstance(content, str):
        return content
    return '\n'.join(c.get('text', '') for c in content if isinstance(c, dict) and c.get('type') == 'text')


def is_human(d):
    if d.get('type') != 'user' or d.get('isSidechain') or d.get('isMeta'):
        return False
    if (d.get('origin') or {}).get('kind') == 'human' or d.get('turnOrigin') == 'human':
        t = TAG.sub('', text_of(d['message'].get('content'))).strip()
        return bool(t) and not t.startswith('<task-notification>')
    return False


def ts(s):
    return datetime.fromisoformat(s.replace('Z', '+00:00')).astimezone(VN)


def load(path):
    turns, cur = [], None
    for line in open(path, encoding='utf-8'):
        try:
            d = json.loads(line)
        except ValueError:
            continue
        if is_human(d):
            cur = {'time': ts(d['timestamp']), 'prompt': TAG.sub('', text_of(d['message']['content'])).strip(),
                   'out': [], 'tools': collections.Counter(), 'model': ''}
            turns.append(cur)
        elif cur and d.get('type') == 'assistant' and not d.get('isSidechain'):
            m = d.get('message', {})
            cur['model'] = cur['model'] or m.get('model', '')
            for c in m.get('content', []) or []:
                if c.get('type') == 'text' and c.get('text', '').strip():
                    cur['out'].append(c['text'].strip())
                elif c.get('type') == 'tool_use':
                    cur['tools'][c.get('name')] += 1
    return turns


def main(src, out):
    turns = []
    for f in glob.glob(os.path.join(src, '*.jsonl')):
        turns += load(f)
    turns.sort(key=lambda t: t['time'])
    L = ['# Nhật ký AI đầy đủ (trích tự động từ transcript Claude Code)', '',
         f'Tạo bởi `tools/extract_ai_log.py` lúc {datetime.now(VN):%Y-%m-%d %H:%M} (giờ VN). Số lượt: **{len(turns)}**.',
         'Công cụ: Claude Code (VS Code extension). Prompt và output là nguyên văn; phần lệnh/công cụ AI chạy chỉ ghi tên và số lần gọi.', '']
    for i, t in enumerate(turns, 1):
        tools = ', '.join(f'{k}×{v}' for k, v in t['tools'].most_common()) or '—'
        L += [f'## Lượt {i} – {t["time"]:%Y-%m-%d %H:%M}', '',
              f'- **Công cụ / model:** Claude Code / `{t["model"] or "?"}`',
              f'- **Công cụ AI đã gọi:** {tools}', '',
              '**Prompt:**', '', '> ' + t['prompt'].replace('\n', '\n> '), '',
              '**Output AI:**', '', '\n\n'.join(t['out']) or '_(không có văn bản)_', '', '---', '']
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write('\n'.join(L))
    print(len(turns), 'luot ->', out)


if __name__ == '__main__':
    main(os.path.expandvars(sys.argv[1]), sys.argv[2])
