import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhoneInputProps {
  value: string;
  countryCode: string;
  onValueChange: (value: string) => void;
  onCountryCodeChange: (code: string) => void;
  disabled?: boolean;
}

// 国内+东盟国家电话代码
const COUNTRY_CODES = [
  { code: '+86', name: '中国', flag: '🇨🇳' },
  { code: '+66', name: '泰国', flag: '🇹🇭' },
  { code: '+84', name: '越南', flag: '🇻🇳' },
  { code: '+62', name: '印尼', flag: '🇮🇩' },
  { code: '+65', name: '新加坡', flag: '🇸🇬' },
  { code: '+60', name: '马来西亚', flag: '🇲🇾' },
  { code: '+63', name: '菲律宾', flag: '🇵🇭' },
  { code: '+95', name: '缅甸', flag: '🇲🇲' },
  { code: '+855', name: '柬埔寨', flag: '🇰🇭' },
  { code: '+856', name: '老挝', flag: '🇱🇦' },
  { code: '+673', name: '文莱', flag: '🇧🇳' },
];

export default function PhoneInput({
  value,
  countryCode,
  onValueChange,
  onCountryCodeChange,
  disabled = false,
}: PhoneInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">手机号</Label>
      <div className="flex gap-2">
        <Select value={countryCode} onValueChange={onCountryCodeChange} disabled={disabled}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_CODES.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <span className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Input
            id="phone"
            type="tel"
            placeholder="请输入手机号"
            value={value}
            onChange={(e) => onValueChange(e.target.value.replace(/\D/g, ''))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            className="pr-10"
          />
          {focused && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {countryCode === '+86' ? '11位' : '8-12位'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
