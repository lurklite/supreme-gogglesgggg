// Discord OAuth Configuration
const DISCORD_CONFIG = {
    // ⚠️ IMPORTANT: Replace these with your actual Discord application credentials
    // Get these from: https://discord.com/developers/applications
    CLIENT_ID: '1432798922757115985',
    CLIENT_SECRET: 'pq_pp9Sp5lK8n3f8LC2-xAvxEROgDFdy',
    // ⚠️ REDIRECT URI - This will automatically detect your URL
    // For GitHub Pages: https://yourusername.github.io/repository-name/
    // For localhost: http://localhost:8080
    // 
    // IMPORTANT: Discord adds a trailing slash, so we keep it!
    // ADD THIS EXACT URL TO DISCORD DEVELOPER PORTAL:
    // https://lurklite.github.io/supreme-gogglesgggg/
    REDIRECT_URI: window.location.origin + window.location.pathname,
    
    // OAuth2 URLs (don't change these)
    AUTHORIZATION_URL: 'https://discord.com/api/oauth2/authorize',
    TOKEN_URL: 'https://discord.com/api/oauth2/token',
    API_ENDPOINT: 'https://discord.com/api/v10',
    
    // Scopes - what info we request from Discord
    SCOPES: ['identify']  // Only username and avatar
};

// Application Configuration
const APP_CONFIG = {
    APP_NAME: 'LURKOUT Script Builder',
    VERSION: '3.5',
    STORAGE_KEY: 'lurkout_auth',
    CONFIG_STORAGE_KEY: 'lurkout_config',
    
    // Default options for script builder
    DEFAULT_OPTIONS: [
        {
            id: 1,
            name: 'Walkspeed',
            enabled: true,
            mode: 'Normal Speed',
            modeScripts: {
                'CFrame Speed': 'local player = game.Players.LocalPlayer\nlocal character = player.Character or player.CharacterAdded:Wait()\nlocal humanoid = character:WaitForChild("Humanoid")\n\n-- CFrame-based speed\nlocal speed = 2\nlocal RunService = game:GetService("RunService")\n\nRunService.Heartbeat:Connect(function()\n    if humanoid.MoveDirection.Magnitude > 0 then\n        character:TranslateBy(humanoid.MoveDirection * speed * 0.016)\n    end\nend)',
                'Normal Speed': 'local player = game.Players.LocalPlayer\nlocal character = player.Character or player.CharacterAdded:Wait()\nlocal humanoid = character:WaitForChild("Humanoid")\n\nhumanoid.WalkSpeed = 32',
                'Tween Speed': 'local player = game.Players.LocalPlayer\nlocal character = player.Character or player.CharacterAdded:Wait()\nlocal humanoid = character:WaitForChild("Humanoid")\nlocal TweenService = game:GetService("TweenService")\n\nlocal tweenInfo = TweenInfo.new(0.5)\nlocal goal = {WalkSpeed = 50}\nlocal tween = TweenService:Create(humanoid, tweenInfo, goal)\ntween:Play()'
            },
            customCode: ''
        },
        {
            id: 2,
            name: 'JumpPower',
            enabled: false,
            mode: 'Normal Jump',
            modeScripts: {
                'Normal Jump': 'local player = game.Players.LocalPlayer\nlocal character = player.Character or player.CharacterAdded:Wait()\nlocal humanoid = character:WaitForChild("Humanoid")\n\nhumanoid.JumpPower = 70',
                'High Jump': 'local player = game.Players.LocalPlayer\nlocal character = player.Character or player.CharacterAdded:Wait()\nlocal humanoid = character:WaitForChild("Humanoid")\n\nhumanoid.JumpPower = 120',
                'Infinite Jump': 'local player = game.Players.LocalPlayer\nlocal UserInputService = game:GetService("UserInputService")\n\nUserInputService.JumpRequest:Connect(function()\n    local character = player.Character\n    if character then\n        local humanoid = character:FindFirstChildOfClass("Humanoid")\n        if humanoid then\n            humanoid:ChangeState(Enum.HumanoidStateType.Jumping)\n        end\n    end\nend)'
            },
            customCode: ''
        },
        {
            id: 3,
            name: 'Flight',
            enabled: false,
            mode: 'Standard Flight',
            modeScripts: {
                'Standard Flight': 'local player = game.Players.LocalPlayer\nlocal character = player.Character or player.CharacterAdded:Wait()\nlocal humanoidRootPart = character:WaitForChild("HumanoidRootPart")\nlocal UserInputService = game:GetService("UserInputService")\n\nlocal flying = true\nlocal speed = 50\n\nlocal bodyVelocity = Instance.new("BodyVelocity")\nbodyVelocity.MaxForce = Vector3.new(4000, 4000, 4000)\nbodyVelocity.Velocity = Vector3.new(0, 0, 0)\nbodyVelocity.Parent = humanoidRootPart\n\ngame:GetService("RunService").Heartbeat:Connect(function()\n    if flying then\n        local moveDirection = Vector3.new(0, 0, 0)\n        if UserInputService:IsKeyDown(Enum.KeyCode.W) then\n            moveDirection = moveDirection + workspace.CurrentCamera.CFrame.LookVector\n        end\n        if UserInputService:IsKeyDown(Enum.KeyCode.S) then\n            moveDirection = moveDirection - workspace.CurrentCamera.CFrame.LookVector\n        end\n        if UserInputService:IsKeyDown(Enum.KeyCode.A) then\n            moveDirection = moveDirection - workspace.CurrentCamera.CFrame.RightVector\n        end\n        if UserInputService:IsKeyDown(Enum.KeyCode.D) then\n            moveDirection = moveDirection + workspace.CurrentCamera.CFrame.RightVector\n        end\n        if UserInputService:IsKeyDown(Enum.KeyCode.Space) then\n            moveDirection = moveDirection + Vector3.new(0, 1, 0)\n        end\n        if UserInputService:IsKeyDown(Enum.KeyCode.LeftShift) then\n            moveDirection = moveDirection - Vector3.new(0, 1, 0)\n        end\n        bodyVelocity.Velocity = moveDirection.Unit * speed\n    end\nend)',
                'Velocity Flight': 'local player = game.Players.LocalPlayer\nlocal character = player.Character or player.CharacterAdded:Wait()\nlocal humanoidRootPart = character:WaitForChild("HumanoidRootPart")\n\nlocal speed = 100\nhumanoidRootPart.Anchored = false\nhumanoidRootPart.Velocity = Vector3.new(0, speed, 0)',
                'CFrame Flight': 'local player = game.Players.LocalPlayer\nlocal character = player.Character or player.CharacterAdded:Wait()\nlocal humanoidRootPart = character:WaitForChild("HumanoidRootPart")\nlocal UserInputService = game:GetService("UserInputService")\n\nlocal speed = 2\n\ngame:GetService("RunService").Heartbeat:Connect(function()\n    local moveDirection = Vector3.new(0, 0, 0)\n    if UserInputService:IsKeyDown(Enum.KeyCode.W) then\n        moveDirection = moveDirection + workspace.CurrentCamera.CFrame.LookVector\n    end\n    if UserInputService:IsKeyDown(Enum.KeyCode.S) then\n        moveDirection = moveDirection - workspace.CurrentCamera.CFrame.LookVector\n    end\n    if UserInputService:IsKeyDown(Enum.KeyCode.Space) then\n        moveDirection = moveDirection + Vector3.new(0, 1, 0)\n    end\n    humanoidRootPart.CFrame = humanoidRootPart.CFrame + (moveDirection * speed)\nend)'
            },
            customCode: ''
        },
        {
            id: 4,
            name: 'ESP',
            enabled: false,
            mode: 'Box ESP',
            modeScripts: {
                'Box ESP': 'local player = game.Players.LocalPlayer\nlocal RunService = game:GetService("RunService")\n\nfor _, otherPlayer in pairs(game.Players:GetPlayers()) do\n    if otherPlayer ~= player then\n        local character = otherPlayer.Character\n        if character then\n            local highlight = Instance.new("Highlight")\n            highlight.FillColor = Color3.fromRGB(255, 0, 0)\n            highlight.OutlineColor = Color3.fromRGB(255, 255, 255)\n            highlight.Parent = character\n        end\n    end\nend',
                'Name ESP': 'local player = game.Players.LocalPlayer\n\nfor _, otherPlayer in pairs(game.Players:GetPlayers()) do\n    if otherPlayer ~= player and otherPlayer.Character then\n        local billboardGui = Instance.new("BillboardGui")\n        billboardGui.Adornee = otherPlayer.Character:WaitForChild("Head")\n        billboardGui.Size = UDim2.new(0, 100, 0, 50)\n        billboardGui.StudsOffset = Vector3.new(0, 3, 0)\n        billboardGui.AlwaysOnTop = true\n        \n        local textLabel = Instance.new("TextLabel")\n        textLabel.Size = UDim2.new(1, 0, 1, 0)\n        textLabel.BackgroundTransparency = 1\n        textLabel.Text = otherPlayer.Name\n        textLabel.TextColor3 = Color3.fromRGB(255, 255, 255)\n        textLabel.TextStrokeTransparency = 0.5\n        textLabel.Font = Enum.Font.GothamBold\n        textLabel.TextSize = 14\n        textLabel.Parent = billboardGui\n        \n        billboardGui.Parent = player.PlayerGui\n    end\nend',
                'Distance ESP': 'local player = game.Players.LocalPlayer\nlocal RunService = game:GetService("RunService")\n\nfor _, otherPlayer in pairs(game.Players:GetPlayers()) do\n    if otherPlayer ~= player and otherPlayer.Character then\n        local billboardGui = Instance.new("BillboardGui")\n        billboardGui.Adornee = otherPlayer.Character:WaitForChild("Head")\n        billboardGui.Size = UDim2.new(0, 100, 0, 50)\n        billboardGui.StudsOffset = Vector3.new(0, 3, 0)\n        billboardGui.AlwaysOnTop = true\n        \n        local textLabel = Instance.new("TextLabel")\n        textLabel.Size = UDim2.new(1, 0, 1, 0)\n        textLabel.BackgroundTransparency = 1\n        textLabel.TextColor3 = Color3.fromRGB(255, 255, 255)\n        textLabel.TextStrokeTransparency = 0.5\n        textLabel.Font = Enum.Font.Gotham\n        textLabel.TextSize = 12\n        textLabel.Parent = billboardGui\n        \n        billboardGui.Parent = player.PlayerGui\n        \n        RunService.Heartbeat:Connect(function()\n            if player.Character and otherPlayer.Character then\n                local distance = (player.Character.HumanoidRootPart.Position - otherPlayer.Character.HumanoidRootPart.Position).Magnitude\n                textLabel.Text = otherPlayer.Name .. " [" .. math.floor(distance) .. " studs]"\n            end\n        end)\n    end\nend',
                'Full ESP': 'local player = game.Players.LocalPlayer\n\nfor _, otherPlayer in pairs(game.Players:GetPlayers()) do\n    if otherPlayer ~= player and otherPlayer.Character then\n        local highlight = Instance.new("Highlight")\n        highlight.FillColor = Color3.fromRGB(255, 0, 0)\n        highlight.OutlineColor = Color3.fromRGB(255, 255, 255)\n        highlight.FillTransparency = 0.5\n        highlight.Parent = otherPlayer.Character\n        \n        local billboardGui = Instance.new("BillboardGui")\n        billboardGui.Adornee = otherPlayer.Character:WaitForChild("Head")\n        billboardGui.Size = UDim2.new(0, 100, 0, 50)\n        billboardGui.StudsOffset = Vector3.new(0, 3, 0)\n        billboardGui.AlwaysOnTop = true\n        \n        local textLabel = Instance.new("TextLabel")\n        textLabel.Size = UDim2.new(1, 0, 1, 0)\n        textLabel.BackgroundTransparency = 1\n        textLabel.Text = otherPlayer.Name\n        textLabel.TextColor3 = Color3.fromRGB(255, 255, 255)\n        textLabel.TextStrokeTransparency = 0.5\n        textLabel.Font = Enum.Font.GothamBold\n        textLabel.TextSize = 14\n        textLabel.Parent = billboardGui\n        \n        billboardGui.Parent = player.PlayerGui\n    end\nend'
            },
            customCode: ''
        },
        {
            id: 5,
            name: 'Aimbot',
            enabled: false,
            mode: 'Head Target',
            modeScripts: {
                'Head Target': 'local player = game.Players.LocalPlayer\nlocal camera = workspace.CurrentCamera\nlocal RunService = game:GetService("RunService")\nlocal UserInputService = game:GetService("UserInputService")\n\nlocal aimbotEnabled = true\nlocal targetPart = "Head"\n\nRunService.RenderStepped:Connect(function()\n    if aimbotEnabled and UserInputService:IsMouseButtonPressed(Enum.UserInputType.MouseButton2) then\n        local closestPlayer = nil\n        local shortestDistance = math.huge\n        \n        for _, otherPlayer in pairs(game.Players:GetPlayers()) do\n            if otherPlayer ~= player and otherPlayer.Character then\n                local targetChar = otherPlayer.Character\n                local head = targetChar:FindFirstChild(targetPart)\n                if head then\n                    local screenPoint, onScreen = camera:WorldToScreenPoint(head.Position)\n                    if onScreen then\n                        local distance = (Vector2.new(screenPoint.X, screenPoint.Y) - UserInputService:GetMouseLocation()).Magnitude\n                        if distance < shortestDistance then\n                            closestPlayer = otherPlayer\n                            shortestDistance = distance\n                        end\n                    end\n                end\n            end\n        end\n        \n        if closestPlayer and closestPlayer.Character then\n            local targetHead = closestPlayer.Character:FindFirstChild(targetPart)\n            if targetHead then\n                camera.CFrame = CFrame.new(camera.CFrame.Position, targetHead.Position)\n            end\n        end\n    end\nend)',
                'Torso Target': 'local player = game.Players.LocalPlayer\nlocal camera = workspace.CurrentCamera\nlocal RunService = game:GetService("RunService")\nlocal UserInputService = game:GetService("UserInputService")\n\nlocal aimbotEnabled = true\nlocal targetPart = "Torso"\n\nRunService.RenderStepped:Connect(function()\n    if aimbotEnabled and UserInputService:IsMouseButtonPressed(Enum.UserInputType.MouseButton2) then\n        local closestPlayer = nil\n        local shortestDistance = math.huge\n        \n        for _, otherPlayer in pairs(game.Players:GetPlayers()) do\n            if otherPlayer ~= player and otherPlayer.Character then\n                local targetChar = otherPlayer.Character\n                local torso = targetChar:FindFirstChild(targetPart) or targetChar:FindFirstChild("UpperTorso")\n                if torso then\n                    local screenPoint, onScreen = camera:WorldToScreenPoint(torso.Position)\n                    if onScreen then\n                        local distance = (Vector2.new(screenPoint.X, screenPoint.Y) - UserInputService:GetMouseLocation()).Magnitude\n                        if distance < shortestDistance then\n                            closestPlayer = otherPlayer\n                            shortestDistance = distance\n                        end\n                    end\n                end\n            end\n        end\n        \n        if closestPlayer and closestPlayer.Character then\n            local targetTorso = closestPlayer.Character:FindFirstChild(targetPart) or closestPlayer.Character:FindFirstChild("UpperTorso")\n            if targetTorso then\n                camera.CFrame = CFrame.new(camera.CFrame.Position, targetTorso.Position)\n            end\n        end\n    end\nend)',
                'Closest Part': 'local player = game.Players.LocalPlayer\nlocal camera = workspace.CurrentCamera\nlocal RunService = game:GetService("RunService")\nlocal UserInputService = game:GetService("UserInputService")\n\nlocal aimbotEnabled = true\n\nRunService.RenderStepped:Connect(function()\n    if aimbotEnabled and UserInputService:IsMouseButtonPressed(Enum.UserInputType.MouseButton2) then\n        local closestPart = nil\n        local shortestDistance = math.huge\n        \n        for _, otherPlayer in pairs(game.Players:GetPlayers()) do\n            if otherPlayer ~= player and otherPlayer.Character then\n                for _, part in pairs(otherPlayer.Character:GetChildren()) do\n                    if part:IsA("BasePart") then\n                        local screenPoint, onScreen = camera:WorldToScreenPoint(part.Position)\n                        if onScreen then\n                            local distance = (Vector2.new(screenPoint.X, screenPoint.Y) - UserInputService:GetMouseLocation()).Magnitude\n                            if distance < shortestDistance then\n                                closestPart = part\n                                shortestDistance = distance\n                            end\n                        end\n                    end\n                end\n            end\n        end\n        \n        if closestPart then\n            camera.CFrame = CFrame.new(camera.CFrame.Position, closestPart.Position)\n        end\n    end\nend)'
            },
            customCode: ''
        }
    ],
    
    // Dropdown options for each type
    DROPDOWN_OPTIONS: {
        'Walkspeed': ['CFrame Speed', 'Normal Speed', 'Tween Speed'],
        'JumpPower': ['Normal Jump', 'High Jump', 'Infinite Jump'],
        'Flight': ['Standard Flight', 'Velocity Flight', 'CFrame Flight'],
        'ESP': ['Box ESP', 'Name ESP', 'Distance ESP', 'Full ESP'],
        'Aimbot': ['Head Target', 'Torso Target', 'Closest Part'],
        'Default': ['Option 1', 'Option 2', 'Option 3']
    }
};

// Helper function to get OAuth URL
function getDiscordOAuthURL() {
    const params = new URLSearchParams({
        client_id: DISCORD_CONFIG.CLIENT_ID,
        redirect_uri: DISCORD_CONFIG.REDIRECT_URI,
        response_type: 'code',
        scope: DISCORD_CONFIG.SCOPES.join(' ')
    });
    
    return `${DISCORD_CONFIG.AUTHORIZATION_URL}?${params.toString()}`;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DISCORD_CONFIG, APP_CONFIG, getDiscordOAuthURL };
}


