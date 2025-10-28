// Output Generator with Syntax Highlighting
class OutputGenerator {
    constructor() {
        this.codeElement = document.getElementById('code-content');
        this.lineCountElement = document.getElementById('line-count');
        this.init();
    }

    init() {
        // Setup copy button
        document.getElementById('copy-output-btn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Setup download button
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

        // Library loader
        script += `-- Load LURKOUT UI Library
loadstring(game:HttpGet("https://raw.githubusercontent.com/lurkout/ui-library/main/source.lua"))()

`;

        // Initialize library
        script += `-- Initialize Library
local Library = LURKOUT:Init()

`;

        // Create main tab
        script += `-- Create Main Tab
local MainTab = Library:CreateTab("Main")

`;

        // Add each enabled option
        enabledOptions.forEach(option => {
            script += this.generateOptionCode(option);
        });

        // Settings tab
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

        // Footer
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
        return `MainTab:AddToggle("${option.name}", false, function(state)
    local LocalPlayer = game:GetService("Players").LocalPlayer
    if state then
        if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") then
            if "${option.mode}" == "CFrame Speed" then
                -- CFrame-based speed boost
                ${option.customCode || 'LocalPlayer.Character.Humanoid.WalkSpeed = 50'}
            elseif "${option.mode}" == "Normal Speed" then
                -- Normal speed modification
                LocalPlayer.Character.Humanoid.WalkSpeed = 32
            else
                -- Tween speed
                LocalPlayer.Character.Humanoid.WalkSpeed = 40
            end
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
        return `MainTab:AddToggle("${option.name}", false, function(state)
    local LocalPlayer = game:GetService("Players").LocalPlayer
    if state then
        if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") then
            if "${option.mode}" == "High Jump" then
                ${option.customCode || 'LocalPlayer.Character.Humanoid.JumpPower = 100'}
            elseif "${option.mode}" == "Infinite Jump" then
                LocalPlayer.Character.Humanoid.JumpPower = 120
            else
                LocalPlayer.Character.Humanoid.JumpPower = 70
            end
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
        return `MainTab:AddToggle("${option.name}", false, function(state)
    -- ${option.mode} implementation
    if state then
        ${option.customCode || '-- Flight code here'}
        Library:Notify("${option.name}", "Enabled with ${option.mode}", 2)
    else
        -- Disable flight
        Library:Notify("${option.name}", "Disabled", 2)
    end
end)

`;
    }

    generateESPCode(option) {
        return `MainTab:AddToggle("${option.name}", false, function(state)
    -- ${option.mode} implementation
    if state then
        ${option.customCode || '-- ESP code here'}
        Library:Notify("${option.name}", "Enabled with ${option.mode}", 2)
    else
        -- Disable ESP
        Library:Notify("${option.name}", "Disabled", 2)
    end
end)

`;
    }

    generateAimbotCode(option) {
        return `MainTab:AddToggle("${option.name}", false, function(state)
    -- ${option.mode} implementation
    if state then
        ${option.customCode || '-- Aimbot code here'}
        Library:Notify("${option.name}", "Enabled with ${option.mode}", 2)
    else
        -- Disable aimbot
        Library:Notify("${option.name}", "Disabled", 2)
    end
end)

`;
    }

    generateGenericCode(option) {
        return `MainTab:AddToggle("${option.name}", false, function(state)
    if state then
        ${option.customCode || '-- Custom code here'}
        Library:Notify("${option.name}", "Enabled with ${option.mode}", 2)
    else
        Library:Notify("${option.name}", "Disabled", 2)
    end
end)

`;
    }

    highlightLua(code) {
        // Lua keywords
        const keywords = [
            'local', 'function', 'end', 'if', 'then', 'else', 'elseif',
            'for', 'while', 'do', 'repeat', 'until', 'return', 'break',
            'in', 'and', 'or', 'not', 'true', 'false', 'nil'
        ];

        // Escape HTML
        let highlighted = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Highlight comments
        highlighted = highlighted.replace(/(--.*$)/gm, '<span class="comment">$1</span>');

        // Highlight strings
        highlighted = highlighted.replace(/(".*?"|'.*?')/g, '<span class="string">$1</span>');

        // Highlight numbers
        highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

        // Highlight keywords
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
            highlighted = highlighted.replace(regex, '<span class="keyword">$1</span>');
        });

        // Highlight function names
        highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="function-name">$1</span>(');

        // Highlight operators
        highlighted = highlighted.replace(/([+\-*/%=<>~])/g, '<span class="operator">$1</span>');

        return highlighted;
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
    }
}

// Initialize output generator when DOM is ready
let outputGenerator = null;

document.addEventListener('DOMContentLoaded', () => {
    outputGenerator = new OutputGenerator();
    window.outputGenerator = outputGenerator;
});
