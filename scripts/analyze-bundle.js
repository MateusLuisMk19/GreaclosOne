#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 Analisando tamanho do bundle...\n");

try {
  // Executar build
  console.log("📦 Executando build...");
  execSync("npm run build", { stdio: "inherit" });

  // Verificar tamanho dos arquivos na pasta dist
  const distPath = path.join(__dirname, "../dist");
  const files = fs.readdirSync(distPath);

  console.log("\n📊 Tamanho dos arquivos:");
  console.log("─".repeat(50));

  files.forEach((file) => {
    if (file.endsWith(".js") || file.endsWith(".css")) {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      const sizeInKB = (stats.size / 1024).toFixed(2);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

      console.log(`${file.padEnd(30)} ${sizeInKB} KB (${sizeInMB} MB)`);
    }
  });

  console.log("\n✅ Análise concluída!");
} catch (error) {
  console.error("❌ Erro durante a análise:", error.message);
  process.exit(1);
}
