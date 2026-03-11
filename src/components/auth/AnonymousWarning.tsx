import React from "react";
import { AlertTriangle, Info } from "lucide-react";

interface AnonymousWarningProps {
  type?: "info" | "warning";
  className?: string;
}

const AnonymousWarning: React.FC<AnonymousWarningProps> = ({
  type = "info",
  className = "",
}) => {
  const isWarning = type === "warning";

  return (
    <div
      className={`p-4 rounded-lg border ${className} ${
        isWarning
          ? "bg-yellow-50 border-yellow-200 text-yellow-800"
          : "bg-blue-50 border-blue-200 text-blue-800"
      }`}
    >
      <div className="flex items-start space-x-3">
        {isWarning ? (
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        ) : (
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        )}
        <div className="text-sm">
          <p className="font-medium mb-1">
            {isWarning ? "Conta Anônima" : "Jogando como Visitante"}
          </p>
          <p>
            {isWarning
              ? "Sua conta anônima tem limitações. Para salvar progresso e acessar recursos completos, considere criar uma conta permanente."
              : "Você está jogando como visitante. Seus dados podem não ser salvos permanentemente."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnonymousWarning;
