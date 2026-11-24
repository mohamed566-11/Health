import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Button, Card } from '../../components/common/UIPrimitives';
import { getDefaultHomeRouteForRole } from '../../services/permissions';

export const NotFoundPage: React.FC = () => {
  const { session } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'الصفحة غير موجودة (404) — موعدي';
  }, []);

  return (
    <div className="max-w-[540px] w-full mx-auto px-4 py-16 text-center">
      <Card padding="lg">
        <div className="text-[42px] font-bold tabular-nums text-[var(--color-dark-teal)] mb-2">
          404
        </div>
        <h1 className="text-[22px] font-bold mb-2">عذرًا، هذه الصفحة غير موجودة</h1>
        <p className="text-[15px] text-[var(--color-secondary-text)] mb-6">
          ربما تم تغيير الرابط أو أن الصفحة التي تبحث عنها غير متوفرة حاليًا.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() =>
              navigate(session ? getDefaultHomeRouteForRole(session.role) : '/')
            }
          >
            العودة إلى الصفحة الرئيسية
          </Button>
          <Link
            to="/"
            className="text-[14px] font-semibold text-[var(--color-dark-teal)] hover:underline px-3 py-2"
          >
            صفحة اختيار الدور
          </Link>
        </div>
      </Card>
    </div>
  );
};
