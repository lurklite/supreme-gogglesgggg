// Output Generator with Syntax Highlighting and Webhook Logging
class OutputGenerator {
    constructor() {
        this.codeElement = document.getElementById('code-content');
        this.lineCountElement = document.getElementById('line-count');
        this.init();
    }

    init() {
        document.getElementById('copy-output-btn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        document.getElementById('download-output-btn').addEventListener('click', () => {
            this.downloadScript();
        });
    }

    generate(options) {
        const script = this.generateScript(options);
        const highlighted = this.highlightLua(script);
        this.codeElement.innerHTML = highlighted;
        this.updateLineCount(script);
    }

    generateScript(options) {
        const enabledOptions = options.filter(opt => opt.enabled);

        let script = `-- LURKOUT UI Library Script
-- Generated on ${new Date().toLocaleString()}
-- Total Options: ${enabledOptions.length}

`;

        script += `-- Load LURKOUT UI Library
loadstring(game:HttpGet("https://raw.githubusercontent.com/lurkout/ui-library/main/source.lua"))()

`;

        script += `-- Initialize Library
local Library = LURKOUT:Init()

`;

        script += `-- Create Main Tab
local MainTab = Library:CreateTab("Main")

`;

        enabledOptions.forEach(option => {
            script += this.generateOptionCode(option);
        });

        script += `
-- Settings Tab
local SettingsTab = Library:CreateTab("Settings")

SettingsTab:AddLabel("⚙️ Configuration")

SettingsTab:AddButton("Reload UI", function()
    Library:Notify("Reload", "Reloading UI...", 1)
    task.wait(1)
    Library.ScreenGui:Destroy()
end)

`;

        script += `-- End of Generated Script
print("LURKOUT Script loaded successfully!")
`;

        return script;
    }

    generateOptionCode(option) {
        let code = `-- ${option.name} (Mode: ${option.mode})\n`;

        switch (option.name) {
            case 'Walkspeed':
                code += this.generateWalkspeedCode(option);
                break;
            case 'JumpPower':
                code += this.generateJumpPowerCode(option);
                break;
            case 'Flight':
                code += this.generateFlightCode(option);
                break;
            case 'ESP':
                code += this.generateESPCode(option);
                break;
            case 'Aimbot':
                code += this.generateAimbotCode(option);
                break;
            default:
                code += this.generateGenericCode(option);
                break;
        }

        code += '\n';
        return code;
    }

    generateWalkspeedCode(option) {
        const modeCode = option.modeScripts && option.modeScripts[option.mode] 
            ? option.modeScripts[option.mode]
            : 'LocalPlayer.Character.Humanoid.WalkSpeed = 50';

        return `MainTab:AddToggle("${option.name}", false, function(state)
    local LocalPlayer = game:GetService("Players").LocalPlayer
    if state then
        if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") then
            -- ${option.mode} mode
            ${modeCode.split('\n').map(line => '            ' + line).join('\n').trim()}
            Library:Notify("${option.name}", "Enabled with ${option.mode}", 2)
        end
    else
        if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") then
            LocalPlayer.Character.Humanoid.WalkSpeed = 16
            Library:Notify("${option.name}", "Disabled", 2)
        end
    end
end)

`;
    }

    generateJumpPowerCode(option) {
        const modeCode = option.modeScripts && option.modeScripts[option.mode] 
            ? option.modeScripts[option.mode]
            : 'LocalPlayer.Character.Humanoid.JumpPower = 100';

        return `MainTab:AddToggle("${option.name}", false, function(state)
    local LocalPlayer = game:GetService("Players").LocalPlayer
    if state then
        if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") then
            -- ${option.mode} mode
            ${modeCode.split('\n').map(line => '            ' + line).join('\n').trim()}
            Library:Notify("${option.name}", "Enabled with ${option.mode}", 2)
        end
    else
        if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") then
            LocalPlayer.Character.Humanoid.JumpPower = 50
            Library:Notify("${option.name}", "Disabled", 2)
        end
    end
end)

`;
    }

    generateFlightCode(option) {
        const modeCode = option.modeScripts && option.modeScripts[option.mode] 
            ? option.modeScripts[option.mode]
            : '-- Flight code here';

        return `MainTab:AddToggle("${option.name}", false, function(state)
    if state then
        -- ${option.mode} mode
        ${modeCode.split('\n').map(line => '        ' + line).join('\n').trim()}
        Library:Notify("${option.name}", "Enabled with ${option.mode}", 2)
    else
        -- Disable flight (remove BodyVelocity if exists)
        local LocalPlayer = game:GetService("Players").LocalPlayer
        if LocalPlayer.Character then
            local hrp = LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                for _, child in pairs(hrp:GetChildren()) do
                    if child:IsA("BodyVelocity") or child:IsA("BodyGyro") then
                        child:Destroy()
                    end
                end
            end
        end
        Library:Notify("${option.name}", "Disabled", 2)
    end
end)

`;
    }

    generateESPCode(option) {
        const modeCode = option.modeScripts && option.modeScripts[option.mode] 
            ? option.modeScripts[option.mode]
            : '-- ESP code here';

        return `MainTab:AddToggle("${option.name}", false, function(state)
    if state then
        -- ${option.mode} mode
        ${modeCode.split('\n').map(line => '        ' + line).join('\n').trim()}
        Library:Notify("${option.name}", "Enabled with ${option.mode}", 2)
    else
        -- Disable ESP (remove highlights and BillboardGuis)
        local LocalPlayer = game:GetService("Players").LocalPlayer
        for _, player in pairs(game.Players:GetPlayers()) do
            if player.Character then
                for _, obj in pairs(player.Character:GetDescendants()) do
                    if obj:IsA("Highlight") then
                        obj:Destroy()
                    end
                end
            end
        end
        for _, gui in pairs(LocalPlayer.PlayerGui:GetChildren()) do
            if gui:IsA("BillboardGui") then
                gui:Destroy()
            end
        end
        Library:Notify("${option.name}", "Disabled", 2)
    end
end)

`;
    }

    generateAimbotCode(option) {
        const modeCode = option.modeScripts && option.modeScripts[option.mode] 
            ? option.modeScripts[option.mode]
            : '-- Aimbot code here';

        return `MainTab:AddToggle("${option.name}", false, function(state)
    if state then
        -- ${option.mode} mode
        ${modeCode.split('\n').map(line => '        ' + line).join('\n').trim()}
        Library:Notify("${option.name}", "Enabled with ${option.mode}", 2)
    else
        -- Disable aimbot
        Library:Notify("${option.name}", "Disabled", 2)
    end
end)

`;
    }

    generateGenericCode(option) {
        const modeCode = option.modeScripts && option.modeScripts[option.mode] 
            ? option.modeScripts[option.mode]
            : (option.customCode || '-- Custom code here');

        return `MainTab:AddToggle("${option.name}", false, function(state)
    if state then
        -- ${option.mode} mode
        ${modeCode.split('\n').map(line => '        ' + line).join('\n').trim()}
        Library:Notify("${option.name}", "Enabled with ${option.mode}", 2)
    else
        Library:Notify("${option.name}", "Disabled", 2)
    end
end)

`;
    }

    highlightLua(code) {
        const keywords = [
            'local', 'function', 'end', 'if', 'then', 'else', 'elseif',
            'for', 'while', 'do', 'repeat', 'until', 'return', 'break',
            'in', 'and', 'or', 'not', 'true', 'false', 'nil'
        ];

        let highlighted = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        let lines = highlighted.split('\n');
        let result = [];

        for (let line of lines) {
            let processedLine = line;
            
            if (processedLine.trim().startsWith('--')) {
                result.push('<span class="comment">' + processedLine + '</span>');
                continue;
            }

            processedLine = processedLine.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
            processedLine = processedLine.replace(/'([^']*)'/g, "<span class='string'>'$1'</span>");

            processedLine = processedLine.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');

            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b(${keyword})\\b(?![^<]*>)`, 'g');
                processedLine = processedLine.replace(regex, '<span class="keyword">$1</span>');
            });

            processedLine = processedLine.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="function-name">$1</span>');

            processedLine = processedLine.replace(/([+\-*/%=<>~])/g, '<span class="operator">$1</span>');

            result.push(processedLine);
        }

        return result.join('\n');
    }

    updateLineCount(code) {
        const lines = code.split('\n').length;
        this.lineCountElement.textContent = `${lines} lines`;
    }

    copyToClipboard() {
        const code = this.codeElement.textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code).then(() => {
                showNotification('Copied', 'Script copied to clipboard!', 'success');
                
                // Log to webhook
                if (typeof WebhookLogger !== 'undefined' && authManager.isAuthenticated()) {
                    const user = authManager.getUser();
                    const enabledOptions = scriptBuilder.options
                        .filter(opt => opt.enabled)
                        .map(opt => opt.name);
                    
                    WebhookLogger.logScriptCopy(user, code.length, enabledOptions);
                }
            }).catch(err => {
                console.error('Copy failed:', err);
                this.fallbackCopy(code);
            });
        } else {
            this.fallbackCopy(code);
        }
    }

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showNotification('Copied', 'Script copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Error', 'Failed to copy to clipboard', 'error');
        }
        
        document.body.removeChild(textarea);
    }

    downloadScript() {
        const code = this.codeElement.textContent;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `lurkout_script_${Date.now()}.lua`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Downloaded', 'Script downloaded successfully!', 'success');
        
        // Log to webhook
        if (typeof WebhookLogger !== 'undefined' && authManager.isAuthenticated()) {
            const user = authManager.getUser();
            const enabledOptions = scriptBuilder.options
                .filter(opt => opt.enabled)
                .map(opt => opt.name);
            
            WebhookLogger.logScriptDownload(user, code.length, enabledOptions);
        }
    }
}

let outputGenerator = null;

document.addEventListener('DOMContentLoaded', () => {
    outputGenerator = new OutputGenerator();
    window.outputGenerator = outputGenerator;
});