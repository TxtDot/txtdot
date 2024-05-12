import ipRangeCheck from 'ip-range-check';
import dns from 'dns';

const subnets = [
  '0.0.0.0/8',
  '127.0.0.0/8',
  '10.0.0.0/8',
  '100.64.0.0/10',
  '169.254.0.0/16',
  '172.16.0.0/12',
  '192.0.0.0/24',
  '192.0.2.0/24',
  '192.88.99.0/24',
  '192.168.0.0/16',
  '198.18.0.0/15',
  '198.51.100.0/24',
  '203.0.113.0/24',
  '224.0.0.0/4',
  '233.252.0.0/24',
  '240.0.0.0/4',
  '255.255.255.255/32',
  '::/128',
  '::1/128',
  '::ffff:0:0/96',
  '::ffff:0:0:0/96',
  '64:ff9b::/96',
  '64:ff9b:1::/48',
  '100::/64',
  '2001:0000::/32',
  '2001:20::/28',
  '2001:db8::/32',
  '2002::/16',
  'fc00::/7',
  'fe80::/64',
  'ff00::/8',
];

export function isLocalResource(addr: string): boolean {
  return ipRangeCheck(addr, subnets);
}

export async function isLocalResourceURL(url: URL): Promise<boolean> {
  // Resolve domain name
  const addr = (await dns.promises.lookup(url.hostname)).address;

  // Check if IP is in local network
  return ipRangeCheck(addr, subnets);
}
