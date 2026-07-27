#!/usr/bin/env python3
"""
Persistent Next.js standalone server supervisor.
Restarts server if it dies.
"""
import subprocess
import time
import os
import signal
import sys

def start_server():
    env = os.environ.copy()
    env['PORT'] = '3000'
    env['HOSTNAME'] = '0.0.0.0'
    env['NODE_OPTIONS'] = '--max-old-space-size=192'
    proc = subprocess.Popen(
        ['node', '.next/standalone/server.js'],
        cwd='/home/z/my-project',
        env=env,
        stdout=open('/tmp/nextprod.log', 'a'),
        stderr=subprocess.STDOUT,
        start_new_session=True
    )
    return proc

def main():
    # Kill any existing
    os.system("pkill -9 -f 'server.js' 2>/dev/null")
    time.sleep(1)
    
    proc = start_server()
    print(f"Started server PID: {proc.pid}", flush=True)
    
    while True:
        time.sleep(2)
        ret = proc.poll()
        if ret is not None:
            print(f"Server died (exit {ret}), restarting...", flush=True)
            time.sleep(2)
            proc = start_server()
            print(f"Restarted server PID: {proc.pid}", flush=True)

if __name__ == '__main__':
    main()
