import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AbilityDimensions } from '@/types';

interface RadarChartProps {
  abilities: AbilityDimensions;
}

export default function RadarChart({ abilities }: RadarChartProps) {
  const dimensions = [
    { key: 'language_accuracy', label: '语言准确性', value: abilities.language_accuracy },
    { key: 'cultural_adaptation', label: '文化适配性', value: abilities.cultural_adaptation },
    { key: 'business_strategy', label: '商务策略', value: abilities.business_strategy },
    { key: 'negotiation_skills', label: '谈判技巧', value: abilities.negotiation_skills },
    { key: 'communication_efficiency', label: '沟通效率', value: abilities.communication_efficiency },
    { key: 'cross_cultural_awareness', label: '跨文化意识', value: abilities.cross_cultural_awareness }
  ];

  // 计算雷达图的点位置
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  const angleStep = (Math.PI * 2) / dimensions.length;

  // 生成背景网格的路径
  const generateGridPath = (scale: number) => {
    const points = dimensions.map((_, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = centerX + Math.cos(angle) * maxRadius * scale;
      const y = centerY + Math.sin(angle) * maxRadius * scale;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  };

  // 生成数据路径
  const dataPath = (() => {
    const points = dimensions.map((dim, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const radius = (dim.value / 100) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  })();

  // 生成轴线
  const axisLines = dimensions.map((_, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const x = centerX + Math.cos(angle) * maxRadius;
    const y = centerY + Math.sin(angle) * maxRadius;
    return { x1: centerX, y1: centerY, x2: x, y2: y };
  });

  // 生成标签位置
  const labels = dimensions.map((dim, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const labelRadius = maxRadius + 30;
    const x = centerX + Math.cos(angle) * labelRadius;
    const y = centerY + Math.sin(angle) * labelRadius;
    return { x, y, label: dim.label, value: dim.value };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>六维能力雷达图</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <svg width="300" height="300" viewBox="0 0 300 300" className="max-w-full">
            {/* 背景网格 */}
            <g className="opacity-20">
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
                <path
                  key={scale}
                  d={generateGridPath(scale)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-muted-foreground"
                />
              ))}
            </g>

            {/* 轴线 */}
            <g className="opacity-30">
              {axisLines.map((line, index) => (
                <line
                  key={index}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-muted-foreground"
                />
              ))}
            </g>

            {/* 数据区域 */}
            <path
              d={dataPath}
              fill="hsl(var(--primary))"
              fillOpacity="0.3"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />

            {/* 数据点 */}
            {dimensions.map((dim, index) => {
              const angle = angleStep * index - Math.PI / 2;
              const radius = (dim.value / 100) * maxRadius;
              const x = centerX + Math.cos(angle) * radius;
              const y = centerY + Math.sin(angle) * radius;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="hsl(var(--primary))"
                />
              );
            })}

            {/* 标签 */}
            {labels.map((label, index) => (
              <g key={index}>
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  className="fill-foreground text-xs font-medium"
                >
                  {label.label}
                </text>
                <text
                  x={label.x}
                  y={label.y + 12}
                  textAnchor="middle"
                  className="fill-primary text-xs font-bold"
                >
                  {label.value}
                </text>
              </g>
            ))}
          </svg>

          {/* 能力列表 */}
          <div className="mt-6 grid w-full grid-cols-2 gap-3 md:grid-cols-3">
            {dimensions.map((dim) => (
              <div key={dim.key} className="flex flex-col space-y-1">
                <div className="text-xs text-muted-foreground">{dim.label}</div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${dim.value}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-primary">{dim.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
